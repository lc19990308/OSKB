import fetch from '@/utils/fetch'

const baseUrl = '/oss/api-v1/system/communityHealth'

export function getReadiness () {
  return fetch({
    url: `${baseUrl}/readiness`,
    method: 'get',
    params: { loading: false }
  })
}

export function getRepositories (params) {
  return fetch({
    url: `${baseUrl}/repositories`,
    method: 'get',
    params: { ...params, loading: false }
  })
}

export function getAssessments (params) {
  return fetch({
    url: `${baseUrl}/assessments`,
    method: 'get',
    params: { ...params, loading: false }
  })
}

export function createAssessment (data) {
  return fetch({
    url: `${baseUrl}/assessments`,
    method: 'post',
    headers: { 'Idempotency-Key': createIdempotencyKey() },
    data: { ...data, loading: false }
  })
}

export function createBatchAssessment (data) {
  return fetch({
    url: `${baseUrl}/assessments/batch`,
    method: 'post',
    headers: { 'Idempotency-Key': createIdempotencyKey() },
    data: { ...data, loading: false }
  })
}

export function getAssessment (assessmentId) {
  return fetch({
    url: `${baseUrl}/assessments/${assessmentId}`,
    method: 'get',
    params: { loading: false }
  })
}

export function getAssessmentMetrics (assessmentId) {
  return fetch({
    url: `${baseUrl}/assessments/${assessmentId}/metrics`,
    method: 'get',
    params: { loading: false }
  })
}

export function getAssessmentEvidence (assessmentId) {
  return fetch({
    url: `${baseUrl}/assessments/${assessmentId}/evidence`,
    method: 'get',
    params: { loading: false }
  })
}

export function getRepositoryAssessmentHistory (repositoryId) {
  return fetch({
    url: `${baseUrl}/repositories/${repositoryId}/history`,
    method: 'get',
    params: { loading: false }
  })
}

export function compareAssessments (assessmentIds) {
  return fetch({
    url: `${baseUrl}/comparisons`,
    method: 'post',
    data: { assessmentIds, loading: false }
  })
}

export function retryAssessment (assessmentId) {
  return fetch({
    url: `${baseUrl}/assessments/${assessmentId}/retry`,
    method: 'post',
    data: { loading: false }
  })
}

export function recalculateAssessment (assessmentId) {
  return fetch({
    url: `${baseUrl}/assessments/${assessmentId}/recalculate`,
    method: 'post',
    data: { loading: false }
  })
}

export function saveManualEvidence (assessmentId, metricCode, data) {
  return fetch({
    url: `${baseUrl}/assessments/${assessmentId}/metrics/${metricCode}/evidence`,
    method: 'put',
    data: { ...data, loading: false }
  })
}

export function deleteManualEvidence (assessmentId, evidenceId) {
  return fetch({
    url: `${baseUrl}/assessments/${assessmentId}/evidence/${evidenceId}`,
    method: 'delete',
    data: { loading: false }
  })
}

function createIdempotencyKey () {
  return `community-health-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}
