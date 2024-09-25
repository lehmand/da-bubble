import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"da-bubble-b9672","appId":"1:225148320813:web:a1fadc75bd04196dfa8ca4","storageBucket":"da-bubble-b9672.appspot.com","apiKey":"AIzaSyAqV9rsMHX-v_13aPPRi59Jyo2RthZGGB0","authDomain":"da-bubble-b9672.firebaseapp.com","messagingSenderId":"225148320813"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage())]
};
