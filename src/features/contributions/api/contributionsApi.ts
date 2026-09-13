import { api } from "@/api/api"
import type { Envelope } from "@/api/types"
import type {
  ContributionDto,
  ContributionReportResponse,
  CreateContributionInput,
  GroupBalanceResponse,
  ListContributionsFilters,
  UpdateContributionInput,
} from "../types/contribution"

async function listContributions(
  filters?: ListContributionsFilters
): Promise<Envelope<ContributionDto[]>> {
  const res = await api.get<Envelope<ContributionDto[]>>("/contributions", {
    params: filters,
  })
  return res.data
}

async function getContribution(id: string): Promise<Envelope<ContributionDto>> {
  const res = await api.get<Envelope<ContributionDto>>(`/contributions/${id}`)
  return res.data
}

async function createContribution(
  input: CreateContributionInput
): Promise<Envelope<ContributionDto>> {
  const res = await api.post<Envelope<ContributionDto>>("/contributions", input)
  return res.data
}

async function updateContribution(
  id: string,
  input: UpdateContributionInput
): Promise<Envelope<ContributionDto>> {
  const res = await api.patch<Envelope<ContributionDto>>(`/contributions/${id}`, input)
  return res.data
}

async function closeContribution(id: string): Promise<Envelope<ContributionDto>> {
  const res = await api.post<Envelope<ContributionDto>>(`/contributions/${id}/close`)
  return res.data
}

async function getReport(id: string): Promise<Envelope<ContributionReportResponse>> {
  const res = await api.get<Envelope<ContributionReportResponse>>(`/contributions/${id}/report`)
  return res.data
}

async function getBalance(): Promise<Envelope<GroupBalanceResponse>> {
  const res = await api.get<Envelope<GroupBalanceResponse>>("/contributions/balance")
  return res.data
}

export const contributionsApi = {
  listContributions,
  getContribution,
  createContribution,
  updateContribution,
  closeContribution,
  getReport,
  getBalance,
}
