import { Routes } from '@angular/router';

// importa os componentes standalone
import { HomeComponent } from './pages/home/home.component';
import { ListarUsuariosComponent } from './pages/usuarios/listar-usuarios/listar-usuarios.component';
import { CadastroUsuarioComponent } from './pages/usuarios/cadastro-usuario/cadastro-usuario.component';
import { ListarAtividadesComponent } from './pages/atividades/listar-atividades/listar-atividades.component';
import { CadastroAtividadeComponent } from './pages/atividades/cadastro-atividade/cadastro-atividade.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'usuarios/listar', component: ListarUsuariosComponent },
  { path: 'usuarios/cadastrar', component: CadastroUsuarioComponent },
  { path: 'usuarios/editar/:id', component: CadastroUsuarioComponent },

  { path: 'atividades/listar', component: ListarAtividadesComponent },
  { path: 'atividades/cadastrar', component: CadastroAtividadeComponent },
  { path: 'atividades/editar/:id', component: CadastroAtividadeComponent },
];