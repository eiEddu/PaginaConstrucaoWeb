import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { AtividadeService } from '../../../services/atividade.service';
import { UsuarioService } from '../../../services/usuario.service';

import { Atividade } from '../../../models/atividade.model';
import { StatusAtividade } from '../../../models/status-atividade.enum';
import { CategoriaAtividade } from '../../../models/categoria.enum';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-cadastro-atividade',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-atividade.component.html',
  styleUrls: ['./cadastro-atividade.component.css']
})
export class CadastroAtividadeComponent implements OnInit {

  private fb = inject(FormBuilder);
  private atividadeService = inject(AtividadeService);
  //private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  atividadeForm!: FormGroup;
  editMode = false;
  atividadeId?: number;

  // enums -> arrays para os <select>
  statusOptions = Object.values(StatusAtividade);
  categoriaOptions = Object.values(CategoriaAtividade);
  usuarios: Usuario[] = [];

  async ngOnInit() {
    // carrega usuários para o multiselect
    //this.usuarios = await this.usuarioService.getAllUsuarios();

    // form
    this.atividadeForm = this.fb.group({
      descricao: ['', [Validators.required, Validators.minLength(3)]],
      dataInicio: ['', Validators.required],
      dataFim: [''],
      categoria: [CategoriaAtividade.FUTEBOL, Validators.required], // default qualquer
      status: [StatusAtividade.PENDENTE, Validators.required],
      //usuariosIds: [[], Validators.required] 
    });

    // edição?
    this.route.paramMap.subscribe(async params => {
      const idParam = params.get('id');
      if (!idParam) return;

      this.editMode = true;
      this.atividadeId = Number(idParam);
      const atividade = await this.atividadeService.getAtividadeById(this.atividadeId);

      if (atividade) {
        this.atividadeForm.patchValue({
          descricao: atividade.descricao,
          dataInicio: atividade.dataInicio,
          dataFim: atividade.dataFim ?? '',
          categoria: atividade.categoria,
          status: atividade.status,
          //usuariosIds: atividade.usuariosIds
        });
      }
    });
  }

  async salvar() {
    if (this.atividadeForm.invalid) {
      Swal.fire({ icon: 'error', title: 'Formulário inválido', text: 'Preencha os campos obrigatórios.' });
      return;
    }

    const dados: Atividade = {
      descricao: this.atividadeForm.value.descricao,
      dataInicio: this.atividadeForm.value.dataInicio,
      dataFim: this.atividadeForm.value.dataFim || undefined,
      categoria: this.atividadeForm.value.categoria,
      status: this.atividadeForm.value.status,
     usuariosIds: this.atividadeForm.value.usuariosIds
    };

    try {
      if (this.editMode && this.atividadeId !== undefined) {
        dados.id = this.atividadeId;
        await this.atividadeService.updateAtividade(dados);
        Swal.fire({ icon: 'success', title: 'Atividade atualizada!', timer: 1400, showConfirmButton: false });
      } else {
        await this.atividadeService.addAtividade(dados);
        Swal.fire({ icon: 'success', title: 'Atividade cadastrada!', timer: 1400, showConfirmButton: false });
      }
      this.router.navigate(['/atividades/listar']);
    } catch (e) {
      console.error(e);
      Swal.fire({ icon: 'error', title: 'Erro ao salvar', text: 'Tente novamente.' });
    }
  }
}
