import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import SignIn from '../../pages/auth/SignIn'
import * as authAPI from '../../api/auth'

vi.mock('../../api/auth', () => ({
  loginRequest: vi.fn(),
  verify2FARequest: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockToast = vi.fn()
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

const renderSignIn = () => {
  return render(
    <BrowserRouter>
      <SignIn />
    </BrowserRouter>
  )
}

describe('SignIn Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders login form correctly', () => {
    renderSignIn()
    
    expect(screen.getByText('Echo Boilerplate')).toBeInTheDocument()
    expect(screen.getByText('Authentication Demo')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation error when fields are empty', async () => {
    const user = userEvent.setup()
    renderSignIn()
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Email and password are required',
        variant: 'destructive',
      })
    })
  })

  it('submits form with valid credentials', async () => {
    const user = userEvent.setup()
    const mockLoginResponse = {
      data: {
        access_token: 'fake-access-token',
        refresh_token: 'fake-refresh-token',
      },
    }
    
    vi.mocked(authAPI.loginRequest).mockResolvedValue(mockLoginResponse)
    
    renderSignIn()
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(authAPI.loginRequest).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
    
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'session',
        JSON.stringify({
          accessToken: 'fake-access-token',
          refreshToken: 'fake-refresh-token',
        })
      )
    })
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('shows 2FA form when 2FA is required', async () => {
    const user = userEvent.setup()
    const error = {
      response: { status: 403 },
    }
    
    vi.mocked(authAPI.loginRequest).mockRejectedValue(error)
    
    renderSignIn()
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Enter 2FA Code')).toBeInTheDocument()
      expect(screen.getByLabelText('2FA Code')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /verify code/i })).toBeInTheDocument()
    })
  })

  it('handles 2FA verification', async () => {
    const user = userEvent.setup()
    
    const loginError = { response: { status: 403 } }
    vi.mocked(authAPI.loginRequest).mockRejectedValue(loginError)
    
    renderSignIn()
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByLabelText('2FA Code')).toBeInTheDocument()
    })
    
    const mock2FAResponse = {
      data: {
        access_token: 'fake-access-token',
        refresh_token: 'fake-refresh-token',
      },
    }
    vi.mocked(authAPI.verify2FARequest).mockResolvedValue(mock2FAResponse)
    
    const twoFactorInput = screen.getByLabelText('2FA Code')
    const verifyButton = screen.getByRole('button', { name: /verify code/i })
    
    await user.type(twoFactorInput, '123456')
    await user.click(verifyButton)
    
    await waitFor(() => {
      expect(authAPI.verify2FARequest).toHaveBeenCalledWith({
        email: 'test@example.com',
        code: '123456',
      })
    })
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('can go back from 2FA form to login form', async () => {
    const user = userEvent.setup()
    
    const loginError = { response: { status: 403 } }
    vi.mocked(authAPI.loginRequest).mockRejectedValue(loginError)
    
    renderSignIn()
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Enter 2FA Code')).toBeInTheDocument()
    })
    
    const backButton = screen.getByRole('button', { name: /back to login/i })
    await user.click(backButton)
    
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('displays error message on login failure', async () => {
    const user = userEvent.setup()
    const error = {
      response: {
        status: 401,
        data: { message: 'Invalid credentials' },
      },
    }
    
    vi.mocked(authAPI.loginRequest).mockRejectedValue(error)
    
    renderSignIn()
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Invalid credentials',
        variant: 'destructive',
      })
    })
  })
})