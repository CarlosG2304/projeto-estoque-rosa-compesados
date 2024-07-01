import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassificacaoCadastroComponent } from './classificacao-cadastro.component';

describe('ClassificacaoCadastroComponent', () => {
  let component: ClassificacaoCadastroComponent;
  let fixture: ComponentFixture<ClassificacaoCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassificacaoCadastroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassificacaoCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
