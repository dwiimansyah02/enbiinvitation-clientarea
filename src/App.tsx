import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';

import Home from './pages/Home';
import GuestBook from './pages/GuestBook';
import Rsvp from './pages/Rsvp';
import Settings from './pages/Settings';
import Login from './pages/Login';

/* Core CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Dark mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme */
import './theme/variables.css';
import './theme/index.css';
import ClientBride from './pages/ClientBride';
import ClientStyle from './pages/ClientStyle';

setupIonicReact();

const isAuthenticated = () => {
  return localStorage.getItem('is_logged_in') === 'true';
};

const ProtectedRoute = ({
  component: Component,
  ...rest
}: {
  component: React.FC;
  path: string;
  exact?: boolean;
}) => (
  <Route
    {...rest}
    render={() => (isAuthenticated() ? <Component /> : <Redirect to="/auth/login" />)}
  />
);

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/auth/login" component={Login} />

        <ProtectedRoute exact path="/home" component={Home} />
        <ProtectedRoute exact path="/client/bride" component={ClientBride} />
        <ProtectedRoute exact path="/client/style" component={ClientStyle} />
        <ProtectedRoute exact path="/guestbook" component={GuestBook} />
        <ProtectedRoute exact path="/rsvp" component={Rsvp} />
        <ProtectedRoute exact path="/settings" component={Settings} />

        <Redirect exact from="/" to="/home" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
