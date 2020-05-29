import * as Yup from 'yup';
import * as models from '../models/listModels';

const Sequelize = require('sequelize');

const config = require(`${__dirname}/../backend/config/database.js`);

class OrdemPedidosController {
  async index(req, res) {
    const resultados = [];
    try {
      if (
        Object.keys(req.body).length !== 0 &&
        req.body.numero_pedido !== 'undefined'
      ) {
        const ordemPedidos = await models.OrdemPedidos.findByPk(
          req.body.numero_pedido
        );
        const pedidos = await models.Pedidos.findAll({
          attributes: ['id_item', 'quantidade'],
          where: { numero_pedido: req.body.numero_pedido },
        });

        const data = ordemPedidos.toJSON();
        data.pedidos = pedidos;
        resultados.push(data);
      } else {
        const ordemPedidos = await models.OrdemPedidos.findAll();
        for (const pedidos of ordemPedidos) {
          const itensPedidos = await models.Pedidos.findAll({
            where: { numero_pedido: pedidos.numero_pedido },
          });
          const data = pedidos.toJSON();
          data.pedidos = itensPedidos;
          resultados.push(data);
        }
      }

      return res.json(resultados);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async store(req, res) {
    /* const subSchmma = {
            numero_pedido:  Yup.number().required().positive().required().integer(),
            valor_total: Yup.number().required().positive().required().test(
                'is-decimal',
                'invalid decimal',
                value => (value + "").match(/^(?!0\d|$)\d*(\.\d{1,4})?$/))
        }


        const schema = Yup.lazy(obj => Yup.object(
            Object.keys(obj).reduce((key, value) => {
                if(key.toString() == 'cliente') {
                    return Yup.string().required()
                }
                else {
                    return subSchmma[key]
                }
            })
        )) */

    const schema = Yup.object().shape({
      numero_pedido: Yup.number().required().positive().required().integer(),
      cliente: Yup.string().default(null).nullable(),
      itens: Yup.array()
        .of(
          Yup.object().shape({
            id_item: Yup.number().required().positive().required().integer(),
            quantidade: Yup.number().required().positive().required().integer(),
          })
        )
        .required(),
      /* valor_total: Yup.number().required().positive().required().test(
                'is-decimal',
                'invalid decimal',
                value => (value + "").match(/^(?!0\d|$)\d*(\.\d{1,4})?$/)) */
    });
    if (!(await schema.validate(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /* const estoqueExists = Estoques.findOne({
            where: { nome_produto: req.body.nome_produto },
        });

        if (estoqueExists) {
            return res.status(400).json({ error: 'Estoque already exists' });
        } */

    const sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config
    );
    try {
      let valorTotalPpedido = 0;
      const resultados = [];
      await sequelize.transaction(async (t) => {
        // eslint-disable-next-line no-restricted-syntax
        for await (const element of req.body.itens) {
          models.ItensCardapio.findByPk(element.id_item).then((valorPedido) => {
            valorTotalPpedido +=
              valorPedido.toJSON().valor * element.quantidade;
            console.log(
              `valorTotalPpedido: ${valorTotalPpedido}\nvalorPedido:${valorPedido}`
            );
          });

          const itensCardapioXEstoque = await models.ItensCardapiosXEstoques.findAll(
            {
              where: { id_item: element.id_item },
            }
          );
          // eslint-disable-next-line no-restricted-syntax
          for (const produto of itensCardapioXEstoque) {
            // eslint-disable-next-line no-await-in-loop
            const atualizarMovimento = await models.MovimentosEstoque.findAll({
              where: { id_produto: produto.id_produto },
              order: [['data_compra', 'DESC']],
              limit: 1,
            });
            // eslint-disable-next-line no-restricted-syntax
            for (const elemento of atualizarMovimento) {
              const valor =
                elemento.quantidade_total -
                produto.quantidade * element.quantidade;
              if (valor < 0) {
                throw new Error('Sem estoque');
              } else {
                // atualizar banco
                // eslint-disable-next-line no-await-in-loop
                await elemento.update(
                  { quantidade_total: valor },
                  { transaction: t }
                );
                resultados.push(elemento);
              }
            }
          }
        }

        /**
         * Agora acerca de calculo de valores do pedido para criar */
        const ordemPedido = await models.OrdemPedidos.create(
          {
            numero_pedido: req.body.numero_pedido,
            cliente: req.body.numero_pedido,
            valor_total: valorTotalPpedido,
          },
          { transaction: t }
        );

        // eslint-disable-next-line no-restricted-syntax
        for (const element of req.body.itens) {
          // eslint-disable-next-line no-await-in-loop
          await models.Pedidos.create(
            {
              numero_pedido: req.body.numero_pedido,
              id_item: element.id_item,
              quantidade: element.quantidade,
            },
            { transaction: t }
          );
        }

        return res.json(ordemPedido.toJSON());
      });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    // const {numero_pedido, createdAt, cliente, valor_total} = await OrdemPedidos.create(req.body);
    // return res.json({numero_pedido, createdAt, cliente, valor_total});
  }
}

export default new OrdemPedidosController();
