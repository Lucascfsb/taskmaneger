import { Request, Response } from 'express';
import { z } from 'zod';
import { CreateTeamService } from '../services/teams/CreateTeamService';
import { ListTeamsService } from '../services/teams/ListTeamsService';
import { UpdateTeamService } from '../services/teams/UpdateTeamService';
import { DeleteTeamService } from '../services/teams/DeleteTeamService';
import { ShowTeamService } from '@/services/teams/ShowTeamService';

export class TeamsController {
  async create(request: Request, response: Response) {
    const createTeamBodySchema = z.object({
      name: z.string().min(2, 'The team name must have at least 2 characters.'),
      description: z.string().optional(),
    });

    const { name, description } = createTeamBodySchema.parse(request.body);

    const createTeamService = new CreateTeamService();
    const team = await createTeamService.execute({ name, description });

    return response.status(201).json(team);
  }

  async show(request: Request, response: Response) {
    const showTeamParamsSchema = z.object({
      id: z.string().uuid('Invalid team ID format'),
    });

    const { id } = showTeamParamsSchema.parse(request.params);

    const showTeamService = new ShowTeamService();
    const team = await showTeamService.execute({ id });

    return response.json(team);
  }

  async list(_request: Request, response: Response) {
    const listTeamsService = new ListTeamsService();
    const teams = await listTeamsService.execute();

    return response.json(teams);
  }

  async update(request: Request, response: Response) {
    const updateTeamParamsSchema = z.object({
      id: z.string(),
    });

    const updateTeamBodySchema = z.object({
      name: z.string().min(2).optional(),
      description: z.string().optional(),
    });

    const { id } = updateTeamParamsSchema.parse(request.params);
    const { name, description } = updateTeamBodySchema.parse(request.body);

    const updateTeamService = new UpdateTeamService();
    const team = await updateTeamService.execute({ id, name, description });

    return response.json(team);
  }

  async delete(request: Request, response: Response) {
    const deleteTeamParamsSchema = z.object({
      id: z.string(),
    });

    const { id } = deleteTeamParamsSchema.parse(request.params);

    const deleteTeamService = new DeleteTeamService();
    await deleteTeamService.execute({ id });

    return response.status(204).send();
  }

  // async addMember(request: Request, response: Response) {
  //   const addMemberParamsSchema = z.object({
  //     id: z.string(),
  //   });

  //   const addMemberBodySchema = z.object({
  //     userId: z.string(),
  //   });

  //   const { id } = addMemberParamsSchema.parse(request.params);
  //   const { userId } = addMemberBodySchema.parse(request.body);

  //   // Chame seu AddTeamMemberService aqui
  //   return response.status(201).json({ message: `Membro ${userId} adicionado ao time ${id}` });
  // }

  // // Novo método 'removeMember' para a rota DELETE /teams/:id/members/:userId
  // async removeMember(request: Request, response: Response) {
  //   const removeMemberParamsSchema = z.object({
  //     id: z.string(),
  //     userId: z.string(),
  //   });

  //   const { id, userId } = removeMemberParamsSchema.parse(request.params);

  //   // Chame seu RemoveTeamMemberService aqui
  //   return response.status(204).send();
  // }
}
