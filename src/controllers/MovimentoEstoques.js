import * as Yup from 'yup';
import MovimentoEstoques from '../models/MovimentosEstoque';

class MovimentoEstoqueeContorller {
  async index(req, res) {
    try {
      const { page = 1, perPage = 10 } = req.query;

      if (req.query.id !== undefined) {
        const movimento = await MovimentoEstoques.findByPk(req.query.id);
        return res.json(movimento);
      }
      if (req.query.nome_produto === undefined) {
        const movimentos = await MovimentoEstoques.findAll({
          limit: perPage,
          offset: (page - 1) * perPage,
          order: ['id_produto'],
        });
        return res.json(movimentos);
      }
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      id_produto: Yup.number().required().positive().required().integer(),
      local: Yup.string().required(),
      preco: Yup.number()
        .required()
        .positive()
        .required()
        .test('is-decimal', 'invalid decimal', (value) =>
          `${value}`.match(/^(?!0\d|$)\d*(\.\d{1,4})?$/)
        ),
      quantidade: Yup.number()
        .required()
        .positive()
        .required()
        .test('is-decimal', 'invalid decimal', (value) =>
          `${value}`.match(/^(?!0\d|$)\d*(\.\d{1,4})?$/)
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const movimentoEstoqueExists = await MovimentoEstoques.findOne({
      where: { id_produto: req.body.id_produto },
      order: [['data_compra', 'DESC']],
    });

    let movimentoEstoque;
    if (movimentoEstoqueExists) {
      movimentoEstoque = await MovimentoEstoques.create({
        id_produto: req.body.id_produto,
        local: req.body.local,
        preco: req.body.preco,
        quantidade: req.body.quantidade,
        quantidade_total:
          movimentoEstoqueExists.toJSON().quantidade_total +
          req.body.quantidade,
      });
    } else {
      movimentoEstoque = await MovimentoEstoques.create({
        id_produto: req.body.id_produto,
        local: req.body.local,
        preco: req.body.preco,
        quantidade: req.body.quantidade,
        quantidade_total: req.body.quantidade,
      });
    }

    return res.json(movimentoEstoque.toJSON());
  }
}

export default new MovimentoEstoqueeContorller();
