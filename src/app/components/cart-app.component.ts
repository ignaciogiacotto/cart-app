import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CatalogComponent } from './catalog/catalog.component';
import { CartItem } from '../models/cartItem';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';
import Swal from 'sweetalert2';
import { ItemsState } from '../store/items.reducer';
import { Store } from '@ngrx/store';
import { add, remove, total } from '../store/items.actions';
import { state } from '@angular/animations';

@Component({
  selector: 'cart-app',
  standalone: true,
  imports: [CatalogComponent, NavbarComponent, RouterOutlet],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit{
  
  products: Product[] = [];

  items: CartItem[] = [];

  constructor(
    private store: Store<{items: ItemsState}>,
    private router: Router,
    private sharingDataService: SharingDataService) { 
      this.store.select('items').subscribe(state => {
        this.items = state.items;
        this.saveSession();    
      })
    }

  ngOnInit(): void {
    this.store.dispatch(total())
    this.onDeleteCart();
    this.onAddCart();
  }

  onAddCart(): void{
    this.sharingDataService.productEventEmitter.subscribe(product =>{

      this.store.dispatch(add({ product }));
      this.store.dispatch(total());

      this.router.navigate(['/cart']);

      Swal.fire({
        title: "Shopping",
        text: "Producto agregado al carrito",
        icon: "success"
      });
    })

  }

  onDeleteCart(): void{
    this.sharingDataService.idProductEventEmitter.subscribe(id =>{
      Swal.fire({
        title: "¿Estas seguro que quieres eliminar este producto del carrito?",
        text: "No podrás deshacer este cambio",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar."
      }).then((result) => {
        if (result.isConfirmed) {

          this.store.dispatch(remove({ id }));
          this.store.dispatch(total());
          this.router.navigate(['/cart']);

          Swal.fire({
            title: "Eliminado!",
            text: "El producto ha sido eliminado.",
            icon: "success"
          });
        }
      });
    })
  }

  saveSession(): void{
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }

}
