import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { ParticipacaoService } from '../../../services/participacao.service';
import { AtividadeService } from '../../../services/atividade.service';
import { UsuarioService } from '../../../services/usuario.service';

import { Participacao } from '../../../models/participacao.model';
import { Atividade } from '../../../models/atividade.model';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-usuario-atividades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './usuario-atividades.component.html',
  styleUrls: ['./usuario-atividades.component.css']
})
export class UsuarioAtividadesComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private participacaoService = inject(ParticipacaoService);
  private atividadeService = inject(AtividadeService);
  private usuarioService = inject(UsuarioService);
  private fb = inject(FormBuilder);

  usuario?: Usuario;
  atividades: Atividade[] = [];
  participacoes: (Participacao & { atividade?: Atividade })[] = [];
  carregando = true;

  // Form para vincular atividade ao sócio
  form!: FormGroup;
  mostrarForm = false; // toggle para exibir/ocultar o formulário

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const usuarioId = Number(idParam);

    // carrega usuário
    this.usuario = await this.usuarioService.getUsuarioById(usuarioId);

    // carrega atividades válidas (com id)
    const todas = await this.atividadeService.getAllAtividades();
    this.atividades = (todas.filter(a => typeof a.id === 'number') as Atividade[]);

    // cria form (reactivo simples, sem nonNullable)
    this.form = this.fb.group({
      atividadeId: ['', Validators.required], // receberá string do <select>, convertida com Number(...)
      data: ['', Validators.required],
      hora: ['', Validators.required],
    });

    await this.carregarParticipacoes(usuarioId);
    this.carregando = false;
  }

  private async carregarParticipacoes(usuarioId: number) {
    const parts = await this.participacaoService.getByUsuario(usuarioId);
    const acts = await this.atividadeService.getAllAtividades();
    const actsMap = new Map<number, Atividade>();
    acts.forEach(a => (typeof a.id === 'number') && actsMap.set(a.id as number, a));

    this.participacoes = parts.map(p => ({
      ...p,
      atividade: (typeof p.atividadeId === 'number') ? actsMap.get(p.atividadeId) : undefined
    }));
  }

  toggleForm() {
    this.mostrarForm = !this.mostrarForm;
    if (this.mostrarForm) {
      this.form.reset({ atividadeId: '', data: '', hora: '' });
    }
  }

  async salvarVinculo() {
    if (!this.usuario?.id) return;
    if (this.form.invalid) return;

    const v: Participacao = {
      usuarioId: this.usuario.id,
      atividadeId: Number(this.form.value.atividadeId),
      data: this.form.value.data as string,
      hora: this.form.value.hora as string
    };

    await this.participacaoService.add(v);
    await this.carregarParticipacoes(this.usuario.id);
    this.mostrarForm = false;
  }

  async removerVinculo(p: Participacao) {
    if (!p.id) return;
    if (!confirm('Remover este vínculo?')) return;

    await this.participacaoService.delete(p.id);
    if (this.usuario?.id) {
      await this.carregarParticipacoes(this.usuario.id);
    }
  }
}
