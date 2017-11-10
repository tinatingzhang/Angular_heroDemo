import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Hero } from './hero';
//import { HEROES } from './mock-heroes';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HeroService{
	private heroesUrl = 'api/heroes';//这里的heroes对应本地mock数据返回的那个字段

	private headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http){}

	getHeroes(): Promise<Hero[]> { //stub桩方法 
		//return Promise.resolve(HEROES);  //Promise返回一个承诺
 
		//以下为模拟web-api方式实现
		//InMemoryWebApiModule将Http客户端默认的后端服务(这是一个辅助服务，负责与远程服务器对话) 替换成了内存 Web API服务：
		return this.http.get(this.heroesUrl) //http.get返回一个 RxJS 的Observable对象
			.toPromise()   //利用toPromise操作符把Observable直接转换成Promise对象
			.then(response => response.json().data as Hero[]) //调用 HTTP 的Reponse对象的json方法
			.catch(this.handleError);
	}

	/*getHeroesSlowly(): Promise<Hero[]>{
		return new Promise(resolve => {
			setTimeout(console.log(222); resolve(this.getHeroes()), 9000);
		});
	}*/

	getHero(id: number): Promise<Hero> {
		//return this.getHeroes().then(heroes => heroes.find(hero => hero.id === id));

		//get-by-id请求，形如：api/hero/:id（如：api/hero/11）
		const url = `${this.heroesUrl}/${id}`;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json().data as Hero)
			.catch(this.handleError);
	}

	update(hero: Hero): Promise<Hero> {
		const url = `${this.heroesUrl}/${hero.id}`;
		return this.http.put(url, JSON.stringify(hero), {headers: this.headers}) //put 的 body 是该英雄的 JSON 字符串,并且在请求头中标记出的 body 的内容类型（application/json）
			.toPromise()
			.then(() => hero)
			.catch(this.handleError);
	}

	create(name: string): Promise<Hero> {
		return this.http.post(this.heroesUrl, JSON.stringify({name:name}), {headers: this.headers})
			.toPromise()
			.then(res => res.json().data as Hero)
			.catch(this.handleError);
	}

	delete(id: number): Promise<Hero> {
		const url = `${this.heroesUrl}/${id}`;
		return this.http.delete(url, {headers: this.headers})
			.toPromise()
			.then(() => null)
			.catch(this.handleError);
	}

	private handleError(error: any): Promise<any>{
		console.error('An error occured lar', error); // for demo purposes only
		return Promise.reject(error.message || error);
	}
}