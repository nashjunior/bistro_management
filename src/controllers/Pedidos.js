import * as Yup from 'yup';
import Pedidos from '../models/Pedidos';
import MovimentosEstoque from '../models/MovimentosEstoque';
import ItensCardapiosXEstoques from '../models/ItensCardapiosXEstoques';

const Sequelize = require('sequelize');

const config = require(`${__dirname}/../backend/config/database.js`);

class PedidosController {
  async index(req, res) {
    try {
      const { page = 1, per_page = 10 } = req.query;

      if (req.query.id !== undefined) {
        const estoque = await Pedidos.findByPk(req.query.id);
        return res.json(estoque);
      }
      if (req.query.nome_produto === undefined) {
        const estoques = await Pedidos.findAll({
          limit: per_page,
          offset: (page - 1) * per_page,
          order: ['numero_pedido'],
        });
        return res.json(estoques);
      }

      const estoques = await Pedidos.findAll({
        where: {
          numero_pedido: req.query.numero_pedido,
        },
        limit: per_page,
        offset: (page - 1) * per_page,
        order: ['numero_pedido'],
      });
      return res.json(estoques);
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
      itens: Yup.array()
        .of(
          Yup.object().shape({
            id_item: Yup.number().required().positive().required().integer(),
            quantidade: Yup.number().required().positive().required().integer(),
          })
        )
        .required(),
    });
    if (!(await schema.validate(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const resultados = [];
    const sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config
    );
    try {
      const result = await sequelize.transaction(async (t) => {
        for (const element of req.body.itens) {
          const itensCardapioXEstoque = await ItensCardapiosXEstoques.findAll({
            where: { id_item: element.id_item },
          });
          for (const produto of itensCardapioXEstoque) {
            const atualizar_movimento = await MovimentosEstoque.findAll({
              where: { id_produto: produto.id_produto },
              order: [['data_compra', 'DESC']],
              limit: 1,
            });
            for (const elemento of atualizar_movimento) {
              const valor =
                elemento.quantidade - produto.quantidade * element.quantidade;
              if (valor <= 0) {
                throw new Error('Sem estoque');
              } else {
                // atualizar banco
                await elemento.update(
                  { quantidade: valor },
                  { transaction: t }
                );
                resultados.push(elemento);
              }
            }
          }
        }
      });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
    return res.json(resultados);
    // return res.json({numero_pedido, id_item, quantidade,});
  }
}

export default new PedidosController();
