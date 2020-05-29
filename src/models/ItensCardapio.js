import Sequelize, { Model } from 'sequelize';

class ItensCardapio extends Model {
  static init(sequelize) {
    super.init(
      {
        id_item: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nome: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        valor: Sequelize.FLOAT,
      },
      { sequelize, timestamps: false, tableName: 'itens_cardapio' }
    );
    return this;
  }
}

export default ItensCardapio;
