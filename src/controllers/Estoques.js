import * as Yup from 'yup';
import Estoques from '../models/Estoques';

class EstoquesController {
  async index(req, res) {
    try {
      const { page = 1, per_page = 10 } = req.query;

      if (req.query.id !== undefined) {
        const estoque = await Estoques.findByPk(req.query.id);
        return res.json(estoque);
      }
      if (req.query.nome_produto === undefined) {
        const estoques = await Estoques.findAll({
          limit: per_page,
          offset: (page - 1) * per_page,
          order: ['nome_produto'],
        });
        return res.json(estoques);
      }

      const estoques = await Estoques.findAll({
        where: {
          nome_produto: { [Op.like]: `%${req.query.nome_produto}%` },
        },
        limit: per_page,
        offset: (page - 1) * per_page,
        order: ['nome_produto'],
      });
      return res.json(estoques);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      nome_produto: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /* const estoqueExists = Estoques.findOne({
            where: { nome_produto: req.body.nome_produto },
        });

        if (estoqueExists) {
            return res.status(400).json({ error: 'Estoque already exists' });
        } */

    const estoques = await Estoques.create(req.body);

    return res.json(estoques.toJSON());
  }
}

export default new EstoquesController();
