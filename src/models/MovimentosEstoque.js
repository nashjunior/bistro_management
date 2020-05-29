import Sequelize, { Model } from 'sequelize';

class MovimentosEstoque extends Model {
  static init(sequelize) {
    super.init(
      {
        id_produto: Sequelize.INTEGER,
        data_compra: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW'),
        },
        local: Sequelize.STRING,
        preco: Sequelize.FLOAT,
        quantidade: Sequelize.FLOAT,
        quantidade_total: Sequelize.FLOAT,
      },
      { sequelize, timestamps: false }
    );
    this.removeAttribute('id');
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Estoques, {
      foreignKey: 'id_produto',
    });
  }
}

export default MovimentosEstoque;
