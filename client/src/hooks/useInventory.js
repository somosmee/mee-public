import { useLazyQuery, useMutation } from '@apollo/react-hooks'

import { INVENTORY_ADJUSTMENT, GET_INVENTORY_MOVEMENTS } from 'src/graphql/inventory/queries'

import useSnackbar from 'src/hooks/useSnackbar'

import { FirebaseEvents } from 'src/utils/enums'

import { analytics } from 'src/firebase'

const useInventory = () => {
  const { openSnackbar } = useSnackbar()

  const [
    getInventoryMovementsExecute,
    getInventoryMovementsResult
  ] = useLazyQuery(GET_INVENTORY_MOVEMENTS, { fetchPolicy: 'network-only' })

  const [inventoryAdjustmentMutate, inventoryAdjustmentResult] = useMutation(INVENTORY_ADJUSTMENT)

  const getInventoryMovements = async (input) => {
    await getInventoryMovementsExecute({ variables: { input } })
  }

  const inventoryAdjustment = async (input) => {
    try {
      await inventoryAdjustmentMutate({ variables: { input } })
      analytics.logEvent(FirebaseEvents.INVENTORY_ADJUSTMENT)
      openSnackbar({ variant: 'success', message: 'Estoque atualizado' })
    } catch (error) {
      openSnackbar({ variant: 'error', message: error.message })
      throw error
    }
  }

  return {
    getInventoryMovements: [getInventoryMovementsResult, getInventoryMovements],
    inventoryAdjustment: [inventoryAdjustmentResult, inventoryAdjustment]
  }
}

export default useInventory
