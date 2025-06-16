import GameLobby from '@/components/pages/GameLobby';
import GamePlay from '@/components/pages/GamePlay';
import GameResults from '@/components/pages/GameResults';

export const routes = {
  lobby: {
    id: 'lobby',
    label: 'Lobby',
    path: '/lobby',
    icon: 'Users',
    component: GameLobby
  },
  game: {
    id: 'game',
    label: 'Game',
    path: '/game',
    icon: 'Gamepad2',
    component: GamePlay
  },
  results: {
    id: 'results',
    label: 'Results',
    path: '/results',
    icon: 'Trophy',
    component: GameResults
  }
};

export const routeArray = Object.values(routes);
export default routes;