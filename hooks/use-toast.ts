"use client"

import type React from "react"

// Adapted from shadcn/ui toast hook
import { useState, useEffect } from "react"

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 1000000

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type Toast = ToastProps & {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success"
}

type ToasterToast = ToastProps

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let memoryState: {
  toasts: Toast[]
} = {
  toasts: [],
}

function dispatch(action: any) {
  memoryState = reducer(memoryState, action)
}

interface Action {
  type: keyof typeof actionTypes
  toast?: ToasterToast
  toastId?: string
}

function reducer(state: typeof memoryState, action: Action): typeof memoryState {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast?.id ? { ...t, ...action.toast } : t)),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        setTimeout(() => {
          dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId,
          })
        }, TOAST_REMOVE_DELAY)
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

export function useToast() {
  const [state, setState] = useState<{
    toasts: Toast[]
  }>(memoryState)

  useEffect(() => {
    function handleChange() {
      setState(memoryState)
    }

    // Subscribe to state changes
    const unsubscribe = subscribeToChanges(handleChange)

    return () => {
      unsubscribe()
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      dispatch({
        type: "DISMISS_TOAST",
        toastId,
      })
    },
  }
}

function subscribeToChanges(callback: () => void) {
  const originalDispatch = dispatch
  dispatch = (action) => {
    originalDispatch(action)
    callback()
  }

  return () => {
    dispatch = originalDispatch
  }
}

export function toast(props: ToasterToast) {
  const id = props.id || genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id,
    dismiss,
    update,
  }
}

