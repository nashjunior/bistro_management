import * as Yup from 'yup';
import ItensCardapio from '../models/ItensCardapio';

class ItensCardapioController {
  async index(req, res) {
    try {
      const { page = 1, per_page = 10 } = req.query;

      if (req.query.id !== undefined) {
        const movimento = await ItensCardapio.findByPk(req.query.id);
        return res.json(movimento);
      }
      if (req.query.nome_produto === undefined) {
        const movimentos = await ItensCardapio.findAll({
          limit: per_page,
          offset: (page - 1) * per_page,
          order: ['id_item'],
        });
        return res.json(movimentos);
      }
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      valor: Yup.number()
        .required()
        .positive()
        .required()
        .test('is-decimal', 'invalid decimal', (value) =>
          `${value}`.match(/^(?!0\d|$)\d*(\.\d{1,4})?$/)
        ),
    });

    /* if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        } */

    /* const estoqueExists = Estoques.findOne({
            where: { nome_produto: req.body.nome_produto },
        });

        if (estoqueExists) {
            return res.status(400).json({ error: 'Estoque already exists' });
        } */

    const itemCardapio = await ItensCardapio.create(req.body);

    return res.json(itemCardapio.toJSON());
  }
}

export default new ItensCardapioController();
