import React, { useState, useEffect, useRef } from 'react'
import { useLazyQuery } from '@apollo/client/react'
import { GET_MEMBERS } from '../../services/queries'

interface Member {
  id: string
  firstName: string
  lastName: string
  memberNumber: string
  documentId: string
  documentType: string
  phoneArea: string
  phoneNumber: string
  user?: {
    email: string
  } | null
  memberType?: {
    id: string
    name: string
    price: number
  }
}

interface GetMembersResponse {
  members: Member[]
}

interface MemberAutocompleteProps {
  onSelect: (member: Member | null) => void
  selectedMember: Member | null
  placeholder?: string
}

export const MemberAutocomplete: React.FC<MemberAutocompleteProps> = ({
  onSelect,
  selectedMember,
  placeholder = 'Buscar miembro por nombre o DNI...'
}) => {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [searchMembers, { data, loading }] = useLazyQuery<GetMembersResponse>(GET_MEMBERS)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Update input value when selectedMember changes
  useEffect(() => {
    if (selectedMember) {
      setInputValue(`${selectedMember.firstName} ${selectedMember.lastName} - DNI: ${selectedMember.documentId}`)
    } else {
      setInputValue('')
    }
  }, [selectedMember])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // If user clears the input, clear selection
    if (value === '') {
      onSelect(null)
      setIsOpen(false)
      return
    }

    // Only search if input has at least 2 characters
    if (value.length >= 2) {
      // Set debounce timer (500ms)
      debounceTimerRef.current = setTimeout(() => {
        searchMembers({
          variables: {
            filters: {
              search: value
            }
          }
        })
        setIsOpen(true)
      }, 500)
    } else {
      setIsOpen(false)
    }
  }

  const handleSelectMember = (member: Member) => {
    onSelect(member)
    setInputValue(`${member.firstName} ${member.lastName} - DNI: ${member.documentId}`)
    setIsOpen(false)
  }

  const handleClearSelection = () => {
    onSelect(null)
    setInputValue('')
    setIsOpen(false)
  }

  const members = data?.members || []

  return (
    <div ref={wrapperRef} className="member-autocomplete-wrapper">
      <div className="member-autocomplete-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="member-autocomplete-input"
        />
        {selectedMember && (
          <button
            type="button"
            onClick={handleClearSelection}
            className="member-autocomplete-clear-btn"
            aria-label="Limpiar selección"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <div className="member-autocomplete-dropdown">
          {loading ? (
            <div className="member-autocomplete-loading">
              <div className="spinner"></div>
              <span>Buscando...</span>
            </div>
          ) : members.length > 0 ? (
            <ul className="member-autocomplete-list">
              {members.map((member) => (
                <li
                  key={member.id}
                  onClick={() => handleSelectMember(member)}
                  className="member-autocomplete-item"
                >
                  <div className="member-item-main">
                    <span className="member-item-name">
                      {member.firstName} {member.lastName}
                    </span>
                    {member.memberNumber && (
                      <span className="member-item-badge">
                        #{member.memberNumber}
                      </span>
                    )}
                  </div>
                  <div className="member-item-details">
                    <span className="member-item-dni">
                      {member.documentType?.toUpperCase() || 'DNI'}: {member.documentId}
                    </span>
                    {member.memberType && (
                      <span className="member-item-type">
                        {member.memberType.name} - ${member.memberType.price}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : inputValue.length >= 2 ? (
            <div className="member-autocomplete-empty">
              No se encontraron miembros
            </div>
          ) : null}
        </div>
      )}

      <style>{`
        .member-autocomplete-wrapper {
          position: relative;
          width: 100%;
        }

        .member-autocomplete-input-container {
          position: relative;
          width: 100%;
        }

        .member-autocomplete-input {
          width: 100%;
          padding: 10px 40px 10px 12px;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
          background-color: white;
        }

        .member-autocomplete-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .member-autocomplete-clear-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          padding: 0;
          line-height: 1;
        }

        .member-autocomplete-clear-btn:hover {
          background: #dc2626;
          transform: translateY(-50%) scale(1.1);
        }

        .member-autocomplete-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
        }

        .member-autocomplete-loading {
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #6b7280;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .member-autocomplete-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .member-autocomplete-item {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid #f3f4f6;
          transition: background-color 0.15s;
        }

        .member-autocomplete-item:last-child {
          border-bottom: none;
        }

        .member-autocomplete-item:hover {
          background-color: #f9fafb;
        }

        .member-item-main {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .member-item-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
        }

        .member-item-badge {
          background: #3b82f6;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }

        .member-item-details {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: #6b7280;
        }

        .member-item-dni {
          font-weight: 500;
        }

        .member-item-type {
          color: #059669;
          font-weight: 500;
        }

        .member-autocomplete-empty {
          padding: 16px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }

        @media (max-width: 640px) {
          .member-autocomplete-dropdown {
            max-height: 300px;
          }

          .member-item-details {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  )
}
