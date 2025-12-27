import {
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import './DefaultViewport.css';
import { colorPaletteOutline, homeOutline, mailUnreadOutline } from 'ionicons/icons';
import HomeDashboard from './components/HomeDashboard';
import HomeBride from './components/HomeBride';
import HomeStyle from './components/HomeStyle';

const Home: React.FC = () => {

  return (
    <IonTabs>
      <IonTab tab="home">
        <HomeDashboard />
      </IonTab>
      <IonTab tab="bride">
        <HomeBride />
      </IonTab>
      <IonTab tab="style">
        <HomeStyle />
      </IonTab>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home">
          <IonIcon icon={homeOutline} />
          Beranda
        </IonTabButton>
        <IonTabButton tab="bride">
          <IonIcon icon={mailUnreadOutline} />
          Data Mempelai
        </IonTabButton>
        <IonTabButton tab="style">
          <IonIcon icon={colorPaletteOutline} />
          Gaya Undangan
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Home;