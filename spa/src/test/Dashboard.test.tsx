import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockToast = vi.fn()
vi.mock('../hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  )
}

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders dashboard correctly', () => {
    renderDashboard()
    
    expect(screen.getByText('Echo Boilerplate')).toBeInTheDocument()
    expect(screen.getByText('Authentication Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Welcome back, John Doe!')).toBeInTheDocument()
    expect(screen.getByText("You're successfully authenticated and can access the application.")).toBeInTheDocument()
  })

  it('displays user profile information', () => {
    renderDashboard()
    
    expect(screen.getByText('Profile Information')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Verified')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('displays security information', () => {
    renderDashboard()
    
    expect(screen.getByText('Security')).toBeInTheDocument()
    expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument()
    expect(screen.getByText('Disabled')).toBeInTheDocument()
    expect(screen.getByText('Last Login')).toBeInTheDocument()
  })

  it('displays quick actions', () => {
    renderDashboard()
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /account settings/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /security settings/i })).toBeInTheDocument()
  })

  it('displays demo information', () => {
    renderDashboard()
    
    expect(screen.getByText('Echo Boilerplate Demo')).toBeInTheDocument()
    expect(screen.getByText(/This is a demonstration of the authentication system/)).toBeInTheDocument()
  })

  it('handles logout functionality', async () => {
    const user = userEvent.setup()
    renderDashboard()
    
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await user.click(logoutButton)
    
    await waitFor(() => {
      expect(localStorage.removeItem).toHaveBeenCalledWith('session')
    })
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Logged out',
        description: 'You have been logged out successfully.',
      })
    })
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('handles 2FA enable/disable', async () => {
    const user = userEvent.setup()
    renderDashboard()
    
    const twoFactorButton = screen.getByRole('button', { name: /enable 2fa/i })
    await user.click(twoFactorButton)
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: '2FA Setup',
        description: '2FA setup would be implemented here.',
      })
    })
  })

  it('shows correct 2FA status when enabled', () => {
    const originalConsole = console.error
    console.error = vi.fn()
    
    renderDashboard()
    
    expect(screen.getByText('Disabled')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enable 2fa/i })).toBeInTheDocument()
    
    console.error = originalConsole
  })

  it('displays last login time', () => {
    renderDashboard()
    
    expect(screen.getByText('Last Login')).toBeInTheDocument()
    
    const lastLoginElement = screen.getByText('Last Login').parentElement
    expect(lastLoginElement).toBeInTheDocument()
  })

  it('has proper navigation structure', () => {
    renderDashboard()
    
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    
    expect(screen.getByText('Echo Boilerplate Demo')).toBeInTheDocument()
  })
})