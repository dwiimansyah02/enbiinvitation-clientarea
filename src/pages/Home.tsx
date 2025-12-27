import {
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import './DefaultViewport.css';
import { colorPaletteOutline, homeOutline, mailUnreadOutline } from 'ionicons/icons';
import HomeDashboard from './components/HomeDashboard';
import HomeBride from './components/HomeBride';
import HomeStyle from './components/HomeStyle';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router';

const Home: React.FC = () => {

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/" to="/home" />
          <Route path="/home" render={() => <HomeDashboard />} exact={true} />
          <Route path="/bride" render={() => <HomeBride />} exact={true} />
          <Route path="/style" render={() => <HomeStyle />} exact={true} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={homeOutline} />
            Beranda
          </IonTabButton>
          <IonTabButton tab="bride" href="/bride">
            <IonIcon icon={mailUnreadOutline} />
            Data Mempelai
          </IonTabButton>
          <IonTabButton tab="style" href="/style">
            <IonIcon icon={colorPaletteOutline} />
            Gaya Undangan
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

export default Home;