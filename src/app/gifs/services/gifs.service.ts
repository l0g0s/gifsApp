import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = '310RDAiLRsIuZu5voCHsuZImzXUoI5FD'
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs'
  private _historial:string[] = []

  public resultados: Gif[] = []

  get historial() {
    return [...this._historial]
  }

  constructor(private http:HttpClient){
    this._historial = JSON.parse(localStorage.getItem("historial")!) || []
    this.resultados = JSON.parse(localStorage.getItem("resultados")!) || []
  }

  buscarGifs(query:string){
    
    query = query.trim().toLowerCase()

    if(query.trim().length == 0) return
    
    if(!this._historial.includes(query)){
      this._historial.unshift(query)
    }else{
      this._historial.splice(this._historial.indexOf(query),1)
      this._historial.unshift(query)
    }
    this._historial = this._historial.splice(0,10)
    localStorage.setItem("historial",JSON.stringify(this._historial))

    const params = new HttpParams()
              .set('api_key',this.apiKey)
              .set('limit','10')
              .set('q',query)
  
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{params})
      .subscribe( (resp) =>{
        this.resultados = resp.data
        localStorage.setItem("resultados",JSON.stringify(this.resultados))
      })
  }

  // async consulta(){
  //   const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=310RDAiLRsIuZu5voCHsuZImzXUoI5FD&q=dragon ball&limit=10')
  //   const data = resp.json()
  //   console.log(data)
  // }

}
