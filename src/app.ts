//our root app component
import {Component, NgModule, Injectable} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {RouterModule, Router, Resolve, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'my-app',
  template: `
    <div id='my-app'>
      <h1>Angular 2 Route Resolve Example</h1>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class App {
  constructor() { }
}

@Component({
  selector: 'master-page',
  template: `
    <div id='master-page'>
      <div>
        <a routerLink="observable1232">Resolve route with Observable</a>
      </div>
      <div>
        <a routerLink="promise">Resolve route with Promise</a>
      </div>
    </div>
  `
})
export class Master {
  constructor() { }
}
@Component({
  template: `
    <h3>Resolved with an Observable (Check the console log)</h3>
    <div>
      <a routerLink="/observable1{{resolvedData}}">Back</a>
    </div>
    <div>
      The resolved data is: {{resolvedData}}
    </div>
  `
})
export class ResolvedWithObservable {
  resolvedData:string = "";
  constructor(private route: ActivatedRoute, private router:Router) {
    console.log("ResolveWithObservable Constructor");
    this.route.data.subscribe(val => {
      console.log(val["data"]);
      this.resolvedData = val["data"];
    });
    
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
     }
  }
  ngOnInit(){
    this.route.data.subscribe(val => {
      console.log("dw",val["data"]);
      this.resolvedData = val["data"];
    });
  }
  ngAfterViewInit(){
    console.log("View init");
  }
}

@Component({
  template: `
    <h3>Resolved with a Promise (Check the console log)</h3>
    <div>
      <a routerLink="">Back</a>
      
    </div>
    <div>
      The resolved data is: {{resolvedData}}
    </div>
  `
})
export class ResolvedWithPromise {
  resolvedData:string = "";
  constructor(private route: ActivatedRoute) {
    console.log("ResolvedWithPromise Constructor");
    this.route.data.subscribe(val => {
      this.resolvedData = val["data"];
    });
  }
  ngOnInit(){
    this.route.data.subscribe(val => {
      this.resolvedData = val["data"];
    });
  }
}

@Injectable()
export class ObservableResolver implements Resolve<string> {
  constructor() { }
  resolve(route:ActivatedRouteSnapshot, state:RouterStateSnapshot): Observable<string> {
    console.log("Resolving Observable...");
    let mockData:string = "";
    return new Observable(observer => {
      setTimeout(() => {
        console.log("Resolved Observable");
        mockData = "Mock Data String (O)"+Math.random()*100;
        observer.next(mockData);
        console.log("Emitted new Observable data");
        setTimeout(() => {
          console.log("Completing Observable");
          observer.complete();
        }, 1000);
      }, 2000);
    });
  }
}

@Injectable()
export class PromiseResolver implements Resolve<string> {
  constructor() { }
  resolve(route:ActivatedRouteSnapshot, state:RouterStateSnapshot): Promise<string> {
    console.log("Resolving Promise...");
    let mockData:string = "";
    return new Promise<string>(resolve => setTimeout(resolve, 2000)).then(() => {
      console.log("Resolved Promise");
      mockData = "Mock Data String (P)";
      return mockData;
    });
  }
}
function htmlFiles(url: UrlSegment[]) {
 return url.length === 1 && url[0].path.startsWith('observable') ? ({consumed: url}) : null;
}
const routes: Routes = [
  {
    path: ''
    component: Master,
  },
  {
    matcher: htmlFiles,
    component: ResolvedWithObservable,
    resolve: {
      data: ObservableResolver
    }
    
    },
     
  {
    path: 'promise',
    component: ResolvedWithPromise,
    resolve: {
      data: PromiseResolver
    }
  }
];

@NgModule({
  imports: [ BrowserModule, RouterModule.forRoot(routes) ],
  declarations: [ App, Master, ResolvedWithObservable, ResolvedWithPromise ],
  providers: [ ObservableResolver ,PromiseResolver ],
  bootstrap: [ App ]
})
export class AppModule {}