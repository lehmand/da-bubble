import { Component, OnInit,inject } from '@angular/core';
import { Firestore, updateDoc, doc, getDoc, addDoc } from '@angular/fire/firestore';
import { Router,RouterModule,ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})



export class DashboardComponent implements OnInit {
  userId:any; 
  // route=inject(Router)
  route = inject(ActivatedRoute);
  firestore=inject(Firestore);
  userObject:any={}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.getUserData(this.userId)
  }

async  getUserData(uid:any){
    const idDoc= doc(this.firestore,'users',uid)
    const getUser= await getDoc(idDoc)
    if(getUser.exists()){
       console.log('yes')
       this.userObject=getUser.data()
       console.log(this.userObject)
    }
  }
}
