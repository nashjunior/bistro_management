import Sequelize, { Model } from 'sequelize';

class Estoques extends Model {
  static init(sequelize) {
    super.init(
      {
        id_produto: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nome_produto: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      { sequelize, timestamps: false }
    );
    return this;
  }
}

export default Estoques;
