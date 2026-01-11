# Address Book Feature

## Overview

The Address Book feature allows users to save and manage wallet addresses with human-readable aliases. This is a **client-side only** feature using LocalStorage, with no backend or smart contract changes required.

## Architecture

### Storage Strategy

- **Primary Storage**: Browser LocalStorage (`slice_address_book_v1`)
- **Seeding**: Preloaded system contacts (DAO, Treasury, Test accounts)
- **Persistence**: User-added contacts are stored separately and merged with system contacts
- **Privacy**: All data stays on the user's device

### Key Components

1. **`useAddressBook` Hook** (`src/hooks/useAddressBook.ts`)
   - Manages contact state and LocalStorage sync
   - Provides `contacts`, `addContact`, `removeContact`
   - Prevents deletion of system contacts
   - Auto-deduplicates by address (case-insensitive)

2. **`PartySelector` Component** (`src/components/create/PartySelector.tsx`)
   - Searchable dropdown using Shadcn Popover
   - Inline "Add Contact" flow for unknown addresses
   - Hover-to-delete for user contacts
   - Visual indicators (avatar, checkmark, delete button)

3. **`PRELOADED_CONTACTS`** (`src/config/contacts.ts`)
   - System contacts that always appear
   - Cannot be deleted by users
   - Serve as initial seed data

## User Flows

### Flow 1: Select Existing Contact
1. Click Party Selector
2. Search or scroll through contacts
3. Click contact to select
4. Name and address are populated

### Flow 2: Add New Contact
1. Click Party Selector
2. Paste a 42-character `0x` address
3. Blue "Add to Contacts" banner appears
4. Click banner to enter alias name
5. Press Enter or click Save icon
6. Contact is saved and immediately selected

### Flow 3: Delete Contact
1. Click Party Selector
2. Hover over a user contact (not system contact)
3. Trash icon appears on right
4. Click trash icon to remove

## Data Structure

```typescript
interface Contact {
  name: string;      // Human-readable alias
  address: string;   // 42-char hex address (0x...)
  avatar?: string;   // Optional (for future enhancement)
}
```

## LocalStorage Schema

**Key**: `slice_address_book_v1`

**Value**: JSON array of user contacts (system contacts NOT stored)

```json
[
  {
    "name": "Alice (My Friend)",
    "address": "0x1234567890123456789012345678901234567890"
  },
  {
    "name": "Bob's Wallet",
    "address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
  }
]
```

## Integration Points

### Create Dispute Wizard

- **Step 2 (Parties)**: Uses `PartySelector` for both Claimant and Defendant
- **Form State**: Populates both `name` and `address` fields
- **Contract Call**: Only `address` is sent to smart contract (name is UI-only)

### Future Enhancements

1. **ENS Integration**: Auto-resolve ENS names to addresses
2. **Cloud Sync**: Optional Supabase backup for cross-device sync
3. **Avatar URLs**: Support custom profile pictures
4. **Import/Export**: JSON download/upload for backup
5. **Tags/Groups**: Categorize contacts (e.g., "Friends", "DAO Members")

## Technical Details

### Deduplication Logic

Contacts are deduplicated by address (case-insensitive):

```typescript
const combined = [...PRELOADED_CONTACTS, ...userContacts].filter(
  (contact, index, self) =>
    index === self.findIndex(
      (c) => c.address.toLowerCase() === contact.address.toLowerCase()
    )
);
```

### System Contact Protection

System contacts cannot be deleted:

```typescript
if (PRELOADED_CONTACTS.some(c => c.address.toLowerCase() === address.toLowerCase())) {
  toast.error("Cannot delete system contact.");
  return;
}
```

### Search Algorithm

Case-insensitive search on both name and address:

```typescript
contacts.filter(c => 
  c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
  c.address.toLowerCase().includes(searchTerm.toLowerCase())
);
```

## Best Practices

1. **Always use lowercase** for address comparisons
2. **Validate address format** before saving (0x + 40 hex chars)
3. **Provide visual feedback** for all actions (toast notifications)
4. **Preserve system contacts** across all operations
5. **Handle LocalStorage errors** gracefully (catch blocks)

## Testing Checklist

- [ ] Add a contact with valid 0x address
- [ ] Search contacts by name
- [ ] Search contacts by address
- [ ] Delete a user contact
- [ ] Attempt to delete a system contact (should fail)
- [ ] Refresh page and verify contacts persist
- [ ] Clear LocalStorage and verify system contacts still appear
- [ ] Paste invalid address (should not trigger "Add to Contacts")
- [ ] Add duplicate address (should replace old entry)

## Troubleshooting

### Contacts not persisting?
- Check browser's LocalStorage quota
- Verify no extensions are blocking LocalStorage
- Check console for errors

### System contacts missing?
- Verify `PRELOADED_CONTACTS` is imported correctly
- Check that hook initialization includes system contacts

### Delete button not appearing?
- Verify contact is not in `PRELOADED_CONTACTS`
- Check CSS `:hover` states are working
- Ensure no z-index conflicts