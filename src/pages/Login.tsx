import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import './DefaultViewport.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [presentToast] = useIonToast();
  const history = useHistory();

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
    try {
      const res = await fetch('https://enbiinvitation.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
    
      if (!res.ok) {
        throw new Error('Login gagal');
      }
    
      const data = await res.json();
      /**
       * data = {
       *   message: "Login success",
       *   token: "...",
       *   user: {
       *     id: 2,
       *     ...
       *   }
       * }
       */
      
      localStorage.setItem('is_logged_in', 'true');
      localStorage.setItem('user_id', data.user.id.toString());
      localStorage.setItem('auth_token', data.token);
    
      presentToast({
        message: 'Login berhasil, mengalihkan',
        duration: 1500,
        position: 'top',
      });
    
      history.replace('/home');
    } catch (err) {
      presentToast({
        message: 'Email atau kata sandi salah',
        duration: 2000,
        color: 'danger',
        position: 'top',
      });
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div id="container">
          <strong>Enbi Clientarea</strong>

          <IonList>
            <IonItem>
              <IonInput
                labelPlacement="stacked"
                type="email"
                label="Email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
              />
            </IonItem>

            <IonItem>
              <IonInput
                labelPlacement="stacked"
                type="password"
                label="Kata Sandi"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
              >
                <IonInputPasswordToggle slot="end" />
              </IonInput>
            </IonItem>
          </IonList>

          <IonButton
            expand="block"
            color="primary"
            onClick={handleLogin}
            disabled={!isFormValid}
          >
            Masuk
          </IonButton>

          <p>
            Lupa kata sandi?{' '}
            <a rel="noopener noreferrer">Reset Kata Sandi</a>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
