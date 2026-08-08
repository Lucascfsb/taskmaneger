import { Request, Response } from 'express';
import { z } from 'zod';
import { CreateTeamService } from '../services/teams/CreateTeamService';
import { ListTeamsService } from '../services/teams/ListTeamsService';
import { UpdateTeamService } from '../services/teams/UpdateTeamService';
import { DeleteTeamService } from '../services/teams/DeleteTeamService';
import { ShowTeamService } from '../services/teams/ShowTeamService';
import { AddTeamMemberService } from '../services/teams/AddTeamMemberService';
import { RemoveTeamMemberService } from '../services/teams/RemoveTeamMemberService';
import { ListTeamMembersService } from '../services/teams/ListTeamMembersService';

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
      id: z.string().uuid(),
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
      id: z.string().uuid(),
    });

    const { id } = deleteTeamParamsSchema.parse(request.params);

    const deleteTeamService = new DeleteTeamService();
    await deleteTeamService.execute({ id });

    return response.status(204).send();
  }

  async addMember(request: Request, response: Response) {
    const addMemberParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const addMemberBodySchema = z.object({
      userId: z.string().uuid(),
    });

    const { id: teamId } = addMemberParamsSchema.parse(request.params);
    const { userId } = addMemberBodySchema.parse(request.body);

    const addTeamMemberService = new AddTeamMemberService();
    const member = await addTeamMemberService.execute({ teamId, userId });

    return response.status(201).json(member);
  }

  async removeMember(request: Request, response: Response) {
    const removeMemberParamsSchema = z.object({
      id: z.string().uuid(),
      userId: z.string().uuid(),
    });

    const { id: teamId, userId } = removeMemberParamsSchema.parse(
      request.params
    );

    const removeTeamMemberService = new RemoveTeamMemberService();
    await removeTeamMemberService.execute({ teamId, userId });

    return response.status(204).send();
  }

  async listMembers(request: Request, response: Response) {
    const listMembersParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id: teamId } = listMembersParamsSchema.parse(request.params);

    const listTeamMembersService = new ListTeamMembersService();
    const members = await listTeamMembersService.execute({ teamId });

    return response.json(members);
  }
}
