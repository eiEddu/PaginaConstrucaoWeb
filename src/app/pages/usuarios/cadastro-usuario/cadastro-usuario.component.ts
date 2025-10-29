import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,CommonModule],
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.css']
})
export class CadastroUsuarioComponent implements OnInit {

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  usuarioForm!: FormGroup;
  editMode = false; // false = criando, true = editando
  usuarioId?: number;

  ngOnInit(): void {
    // monta o formulário reativo
    this.usuarioForm = this.fb.group({
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      contato: ['',[Validators.required,Validators.minLength(11)]]
    });

    // verifica se estamos em /usuarios/editar/:id
    this.route.paramMap.subscribe(async params => {
      const idParam = params.get('id');
      if (idParam) {
        this.editMode = true;
        this.usuarioId = Number(idParam);

        const usuario = await this.usuarioService.getUsuarioById(this.usuarioId);
        if (usuario) {
          this.usuarioForm.patchValue({
            nomeCompleto: usuario.nomeCompleto,
            email: usuario.email,
            contato: usuario.contato
          });
        }
      }
    });
  }

  async salvar() {
    // se form inválido -> alerta
    if (this.usuarioForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Formulário inválido',
        text: 'Preencha todos os campos corretamente antes de salvar.'
      });
      return;
    }

    // monta objeto Usuario a partir do form
    const dados: Usuario = {
      nomeCompleto: this.usuarioForm.value.nomeCompleto,
      email: this.usuarioForm.value.email,
      contato: this.usuarioForm.value.contato
    };

    try {
      if (this.editMode && this.usuarioId !== undefined) {
        // atualização
        dados.id = this.usuarioId;
        await this.usuarioService.updateUsuario(dados);

        Swal.fire({
          icon: 'success',
          title: 'Usuário atualizado!',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        // criação
        await this.usuarioService.addUsuario(dados);

        Swal.fire({
          icon: 'success',
          title: 'Usuário cadastrado!',
          timer: 1500,
          showConfirmButton: false
        });
      }

      // depois de salvar, manda pra listagem
      this.router.navigate(['/usuarios/listar']);

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao salvar',
        text: 'Não foi possível salvar o usuário.'
      });
    }
  }
}