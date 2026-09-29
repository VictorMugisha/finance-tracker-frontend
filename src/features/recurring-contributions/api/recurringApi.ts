import { api } from "@/api/api"
import type { Envelope } from "@/api/types"
import type {
  CreateRecurringInput,
  RecurringContributionDetailResponse,
  RecurringContributionDto,
  RecurringReportResponse,
  RolloverInput,
  RolloverResult,
  UpdateRecurringInput,
} from "../types/recurring"

async function list(): Promise<Envelope<RecurringContributionDto[]>> {
  const res = await api.get<Envelope<RecurringContributionDto[]>>("/recurring-contributions")
  return res.data
}

async function create(input: CreateRecurringInput): Promise<Envelope<RecurringContributionDto>> {
  const res = await api.post<Envelope<RecurringContributionDto>>("/recurring-contributions", input)
  return res.data
}

async function update(
  id: string,
  input: UpdateRecurringInput
): Promise<Envelope<RecurringContributionDto>> {
  const res = await api.patch<Envelope<RecurringContributionDto>>(
    `/recurring-contributions/${id}`,
    input
  )
  return res.data
}

async function getDetail(id: string): Promise<Envelope<RecurringContributionDetailResponse>> {
  const res = await api.get<Envelope<RecurringContributionDetailResponse>>(
    `/recurring-contributions/${id}`
  )
  return res.data
}

async function getReport(id: string): Promise<Envelope<RecurringReportResponse>> {
  const res = await api.get<Envelope<RecurringReportResponse>>(`/recurring-contributions/${id}/report`)
  return res.data
}

async function rollover(id: string, input: RolloverInput): Promise<Envelope<RolloverResult>> {
  const res = await api.post<Envelope<RolloverResult>>(
    `/recurring-contributions/${id}/rollover`,
    input
  )
  return res.data
}

async function close(id: string): Promise<Envelope<RecurringContributionDto>> {
  const res = await api.post<Envelope<RecurringContributionDto>>(`/recurring-contributions/${id}/close`)
  return res.data
}

async function reopen(id: string): Promise<Envelope<RecurringContributionDto>> {
  const res = await api.post<Envelope<RecurringContributionDto>>(
    `/recurring-contributions/${id}/reopen`
  )
  return res.data
}

export const recurringApi = {
  list,
  create,
  update,
  getDetail,
  getReport,
  rollover,
  close,
  reopen,
}
