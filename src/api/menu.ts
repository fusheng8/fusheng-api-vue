import type { MenuData } from '~/layouts/basic-layout/typing.ts'

export function getRouteMenusApi() {
  return useGet<MenuData>('/menu')
}
