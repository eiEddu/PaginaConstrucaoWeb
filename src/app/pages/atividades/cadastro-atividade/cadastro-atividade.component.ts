import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { AtividadeService } from '../../../services/atividade.service';
import { Atividade } from '../../../models/atividade.model';
import { StatusAtividade } from '../../../models/status-atividade.enum';
import { CategoriaAtividade } from '../../../models/categoria.enum';

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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  atividadeForm!: FormGroup;
  editMode = false;
  atividadeId?: number;

  statusOptions = Object.values(StatusAtividade);
  categoriaOptions = Object.values(CategoriaAtividade);

  ngOnInit() {
    this.atividadeForm = this.fb.group({
      descricao: ['', [Validators.required, Validators.minLength(3)]],
      dataInicio: ['', Validators.required],
      dataFim: [''],
      categoria: [CategoriaAtividade.FUTEBOL, Validators.required],
      status: [StatusAtividade.AGUARDANDO_ALUNOS, Validators.required]
    });

    this.route.paramMap.subscribe(async params => {
      const idParam = params.get('id');
      if (!idParam) return;

      this.editMode = true;
      this.atividadeId = Number(idParam);
      const a = await this.atividadeService.getAtividadeById(this.atividadeId);
      if (a) this.atividadeForm.patchValue(a);
    });
  }

  async salvar() {
    if (this.atividadeForm.invalid) {
      Swal.fire({ icon: 'error', title: 'Formulário inválido', text: 'Preencha os campos obrigatórios.' });
      return;
    }
    const dados: Atividade = { ...this.atividadeForm.value };

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
    } catch {
      Swal.fire({ icon: 'error', title: 'Erro ao salvar', text: 'Tente novamente.' });
    }
  }
}
