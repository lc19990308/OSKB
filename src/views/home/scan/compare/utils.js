import componentApi from '@/api/home/scan/app/component/compare'
import sbomApi from '@/api/home/scan/sbom/compare'
import ideApi from '@/api/home/scan/develop/ide/compare'
import gitApi from '@/api/home/scan/develop/repository/git/compare'
import svnApi from '@/api/home/scan/develop/repository/svn/compare'
import fireflyApi from '@/api/home/scan/develop/repository/firefly/compare'
import integrationApi from '@/api/home/scan/integration/sourceCode//compare'
import nodeApi from '@/api/home/scan/node/compare'
import privateApi from '@/api/home/scan/private/compare'

import { appList } from '@/api/home/assets/app/component'
import { appList as sbomList } from '@/api/home/scan/sbom'
import { ideList } from '@/api/home/scan/develop/ide'
import { getGitRepositoryList } from '@/api/home/scan/develop/repository/git'
import { getSvnList } from '@/api/home/scan/develop/repository/svn'
import { getSvnList as getFireflyList } from '@/api/home/scan/develop/repository/firefly'
import { integrationList } from '@/api/home/scan/integration/sourceCode'
import { integrationImageList } from '@/api/home/scan/integration/mirrorImage'
import { nodeList } from '@/api/home/scan/node'
import { libraryList } from '@/api/home/scan/private'

const dict = {
  component: {
    ...componentApi,
    getSelectOptions: appList,
    backPath: '/scan/app/component/list',
    successStatus: 2,
    baseInfoField: ['byteSize', 'uploadDate', 'finishDate', 'detectDuration', 'checkType', 'vulNum']
  },
  sbom: {
    ...sbomApi,
    getSelectOptions: sbomList,
    backPath: '/scan/sbom/list',
    successStatus: 2,
    baseInfoField: ['byteSize', 'uploadDate', 'finishDate', 'detectDuration', 'vulNum']
  },
  ide: {
    ...ideApi,
    getSelectOptions: ideList,
    backPath: '/scan/develop/ide/list',
    successStatus: 2,
    baseInfoField: ['byteSize', 'uploadDate', 'finishDate', 'detectDuration', 'vulNum']
  },
  git: {
    ...gitApi,
    getSelectOptions: getGitRepositoryList,
    backPath: '/scan/develop/repository/list/git',
    successStatus: 4,
    baseInfoField: ['finishDate', 'detectDuration', 'checkType', 'vulNum']
  },
  svn: {
    ...svnApi,
    getSelectOptions: getSvnList,
    backPath: '/scan/develop/repository/list/svn',
    successStatus: 4,
    baseInfoField: ['finishDate', 'detectDuration', 'checkType', 'vulNum']
  },
  firefly: {
    ...fireflyApi,
    getSelectOptions: getFireflyList,
    backPath: '/scan/develop/repository/list/firefly',
    successStatus: 4,
    baseInfoField: ['finishDate', 'detectDuration', 'checkType', 'vulNum']
  },
  integrationSourceCode: {
    ...integrationApi,
    getSelectOptions: integrationList,
    backPath: '/scan/integration/list/sourceCode',
    successStatus: 2,
    baseInfoField: ['startDate', 'finishDate', 'detectDuration', 'checkType', 'vulNum']
  },
  integrationMirrorImage: {
    getSelectOptions: integrationImageList,
    backPath: '/scan/integration/list/mirrorImage',
    successStatus: 6,
    baseInfoField: ['createDate', 'finishDate', 'detectDuration', 'size', 'qualityResult', 'sensitive', 'vulNumVO']
  },
  node: {
    ...nodeApi,
    getSelectOptions: nodeList,
    backPath: '/scan/node/list',
    successStatus: undefined,
    baseInfoField: ['installTime', 'vulNum']
  },
  private: {
    ...privateApi,
    getSelectOptions: libraryList,
    backPath: '/scan/private/list',
    successStatus: 7,
    baseInfoField: ['detectDuration']
  },
  mirror: {
    backPath: '/scan/container/mirror/list',
    successStatus: 6,
    baseInfoField: ['createDate', 'finishDate', 'detectDuration', 'size', 'qualityResult', 'sensitive', 'vulNumVO']
  }
}

const requestApi = {
  getBackPath (moduleName) {
    return dict[moduleName].backPath
  },
  getBaseInfoFieldKeys (moduleName) {
    return dict[moduleName].baseInfoField
  },
  getSelectOptions (moduleName, params) {
    return dict[moduleName].getSelectOptions({
      ...params,
      status: dict[moduleName].successStatus
    })
  },
  getComponentCompare (moduleName, params) {
    return dict[moduleName].getComponentCompare(params)
  },
  exportCompareSBOM (moduleName, params) {
    return dict[moduleName].exportCompareSBOM(params)
  },
  getCompareCount  (moduleName, params) {
    return dict[moduleName].getCompareCount(params)
  },
  getVulCompare (moduleName, params) {
    return dict[moduleName].getVulCompare(params)
  },
  getLicenseCompare (moduleName, params) {
    return dict[moduleName].getLicenseCompare(params)
  }
}

export default requestApi
