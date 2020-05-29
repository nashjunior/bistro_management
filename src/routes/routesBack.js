import { Router } from 'express';
import * as controller from '../controllers/listControllers';

const routesBackend = new Router();

routesBackend.post('/estoques', controller.Estoques.store);
routesBackend.post('/movimentos_esqtoque', controller.MovimentoEstoques.store);
routesBackend.post('/itens_cardapio', controller.ItensCardapio.store);
routesBackend.post(
  '/intens_cardapio_X_estoques',
  controller.ItensCardapioXEstpoques.store
);
routesBackend.post('/ordem_pedidos', controller.OrdemPedidos.store);
routesBackend.post('/pedidos', controller.Pedidos.store);

routesBackend.get('/estoques', controller.Estoques.index);
routesBackend.get('/movimentos_esqtoque', controller.MovimentoEstoques.index);
routesBackend.get('/itens_cardapio', controller.ItensCardapio.index);
routesBackend.get(
  '/intens_cardapio_X_estoques',
  controller.ItensCardapioXEstpoques.index
);
routesBackend.get('/ordem_pedidos', controller.OrdemPedidos.index);
routesBackend.get('/pedidos', controller.Pedidos.index);

export default routesBackend;
