# Database E-R Diagram

This diagram shows the structure of your PostgreSQL database and how the different tables are related to each other.

```mermaid
erDiagram
    USERS ||--o{ POSTS : "writes"
    USERS ||--o{ COMMENTS : "writes"
    USERS ||--o{ MEDIA : "uploads"
    
    POSTS ||--o{ COMMENTS : "has"
    POSTS ||--o{ POST_CATEGORIES : "categorized in"
    POSTS ||--o{ POST_TAGS : "tagged with"
    
    CATEGORIES ||--o{ POST_CATEGORIES : "contains"
    TAGS ||--o{ POST_TAGS : "contains"
    
    COMMENTS ||--o{ COMMENTS : "parent of (replies)"

    USERS {
        int id PK
        varchar username
        varchar email
        text password_hash
        varchar role
        text avatar_url
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    POSTS {
        int id PK
        int author_id FK
        varchar title
        varchar slug
        text excerpt
        text body
        text cover_image_url
        varchar status
        timestamptz published_at
        timestamptz deleted_at
        timestamptz created_at
        timestamptz updated_at
    }

    CATEGORIES {
        int id PK
        varchar name
        varchar slug
        text description
        timestamptz updated_at
    }

    POST_CATEGORIES {
        int post_id PK, FK
        int category_id PK, FK
    }

    TAGS {
        int id PK
        varchar name
        varchar slug
        timestamptz updated_at
    }

    POST_TAGS {
        int post_id PK, FK
        int tag_id PK, FK
    }

    COMMENTS {
        int id PK
        int post_id FK
        int author_id FK
        int parent_id FK
        text body
        boolean is_approved
        timestamptz created_at
        timestamptz updated_at
    }

    MEDIA {
        int id PK
        varchar filename
        varchar mimetype
        int size
        int uploader_id FK
        timestamptz created_at
        timestamptz updated_at
    }
```

## Table Breakdown

### 👤 Users
The core table for authentication and profile management.
*   **Roles:** Defaults to 'author', but can be changed to 'admin'.
*   **Security:** Passwords are stored as hashes (never plain text).

### 📝 Posts
Contains the actual blog content.
*   **Relationship:** Every post belongs to one user (`author_id`).
*   **Slug:** Used for SEO-friendly URLs (e.g., `/posts/my-awesome-blog`).

### 📂 Categories & Tags
Used for organizing content.
*   **Many-to-Many:** Since a post can have many tags, and a tag can belong to many posts, we use "junction tables" (`post_categories` and `post_tags`) to link them.

### 💬 Comments
Allows user interaction.
*   **Threaded Replies:** The `parent_id` column allows a comment to "point" to another comment, creating a reply thread.
*   **Anonymous/User:** Linked to `author_id` if logged in.

### 🖼️ Media
Tracks uploaded files (images, etc.).
*   **Relationship:** Tracks which user uploaded which file via `uploader_id`.
