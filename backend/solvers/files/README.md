# File And Container Solvers

Put file-based challenge solvers in this folder.

## Topics For This Folder

```text
zip_solver.py   Password protected ZIP challenges
luks.py         LUKS encrypted volume challenges
```

## Related Existing File

General upload parsing currently lives in:

```text
backend/file_parser.py
```

It already handles:

- text uploads,
- PDF text extraction with `pypdf`,
- binary hex preview for unknown files.

## Solver Guidelines

File solvers should not blindly run destructive or expensive cracking jobs. Prefer:

- parse metadata,
- show the user what was found,
- support small dictionary examples,
- return safe next steps for large real-world cracking tasks.

For ZIP challenges, start with:

- list filenames,
- detect encryption,
- test a small provided wordlist,
- return the password and extracted text if found.

For LUKS challenges, start with:

- parse visible header metadata,
- identify cipher/hash settings,
- explain the required external cracking workflow,
- avoid mounting or modifying disk images automatically.

