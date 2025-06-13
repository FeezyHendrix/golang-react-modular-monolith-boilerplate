import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import SignUp from '../../pages/auth/SignUp'
import * as authAPI from '../../api/auth'

// Mock the auth API
vi.mock('../../api/auth', () => ({
  signupRequest: vi.fn(),
}))

// Mock react-router-dom navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock the toast hook
const mockToast = vi.fn()
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

const renderSignUp = () => {
  return render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>
  )
}

describe('SignUp Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders signup form correctly', () => {
    renderSignUp()
    
    expect(screen.getByText('Echo Boilerplate')).toBeInTheDocument()
    expect(screen.getByText('Authentication Demo')).toBeInTheDocument()
    expect(screen.getByText('Create an account')).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('shows validation error when fields are empty', async () => {
    const user = userEvent.setup()
    renderSignUp()
    
    const submitButton = screen.getByRole('button', { name: /sign up/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'All fields are required',
        variant: 'destructive',
      })
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    const mockSignupResponse = {
      data: {
        access_token: 'fake-access-token',
        refresh_token: 'fake-refresh-token',
      },
    }
    
    vi.mocked(authAPI.signupRequest).mockResolvedValue(mockSignupResponse)
    
    renderSignUp()
    
    const nameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign up/i })
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(authAPI.signupRequest).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
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
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Account created successfully',
        description: 'Please check your email for verification.',
      })
    })
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderSignUp()
    
    const passwordInput = screen.getByLabelText('Password')
    const toggleButton = screen.getByLabelText('Show password')
    
    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Click to show password
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Click to hide password again
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('displays error message on signup failure', async () => {
    const user = userEvent.setup()
    const error = {
      response: {
        data: { message: 'Email already exists' },
      },
    }
    
    vi.mocked(authAPI.signupRequest).mockRejectedValue(error)
    
    renderSignUp()
    
    const nameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign up/i })
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'existing@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Email already exists',
        variant: 'destructive',
      })
    })
  })

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup()
    
    // Mock a delayed response
    vi.mocked(authAPI.signupRequest).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        data: {
          access_token: 'fake-access-token',
          refresh_token: 'fake-refresh-token',
        },
      }), 100))
    )
    
    renderSignUp()
    
    const nameInput = screen.getByLabelText('Full Name')
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign up/i })
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    // Should show loading state
    expect(screen.getByRole('button', { name: /creating account.../i })).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    
    // Wait for completion
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('has link to sign in page', () => {
    renderSignUp()
    
    const signInLink = screen.getByRole('link', { name: /sign in/i })
    expect(signInLink).toBeInTheDocument()
    expect(signInLink).toHaveAttribute('href', '/login')
  })
})