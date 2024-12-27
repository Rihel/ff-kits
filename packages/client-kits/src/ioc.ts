import { AwilixContainer, InjectionMode, asValue, createContainer } from 'awilix'
import React, { createContext, useContext } from 'react'

import { IocContainer } from './interfaces'

export const ioc = createContainer<IocContainer>({
  injectionMode: InjectionMode.PROXY,
})
ioc.register({
  ioc: asValue(ioc),
})
export { IocContainer }




export const IocContext = createContext<AwilixContainer | null>(null)

export function useIoc() {
  return useContext(IocContext) as AwilixContainer
}
