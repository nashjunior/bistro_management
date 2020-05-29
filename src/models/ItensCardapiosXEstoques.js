import Sequelize, { Model } from 'sequelize';

class ItensCardapiosXEstoques extends Model {
  static init(sequelize) {
    super.init(
      {
        id_produto: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        id_item: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        quantidade: Sequelize.FLOAT,
      },
      { sequelize, timestamps: false, tableName: 'itenscardapios_x_estoques' }
    );
    this.removeAttribute('id');
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Estoques, {
      foreignKey: 'id_produto',
    });
    this.belongsTo(models.ItensCardapio, {
      foreignKey: 'id_item',
    });
  }
}

export default ItensCardapiosXEstoques;
