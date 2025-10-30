import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioAtividadesComponent } from './usuario-atividades.component';

describe('UsuarioAtividadesComponent', () => {
  let component: UsuarioAtividadesComponent;
  let fixture: ComponentFixture<UsuarioAtividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioAtividadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioAtividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
