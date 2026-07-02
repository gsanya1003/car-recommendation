========================================================================
DRIVEMATCH AI — FULL-STACK CAR RECOMMENDATION ENGINE SETUP GUIDE
========================================================================

1. ARCHITECTURE & TECH STACK OVERVIEW
------------------------------------------------------------------------
* Backend API Layer: Java, Spring Boot, H2 In-Memory Relational Database
* Frontend UI Layer: React, Vite, TypeScript, Tailwind CSS v4, Lucide Icons
* Code Optimization: Oxlint (Rust-based high-speed code linter)

The frontend client and backend service run completely decoupled, 
communicating purely via asynchronous JSON REST payloads over local network ports.


2. 2-MINUTE END-TO-END LOCAL SETUP ROUTINE
------------------------------------------------------------------------
Ensure you have Java JDK 17+ and Node.js (v18+) installed before booting.

[STEP A] INITIALIZE THE SPRING BOOT BACKEND SERVICE
1. Open a terminal instance in the root project folder ('car-ai-assignment').
2. Run the platform-specific Maven wrapper script to start the service:
   
   On Windows (PowerShell / Command Prompt):
   .\mvnw.cmd spring-boot:run

   On macOS / Linux:
   ./mvnw spring-boot:run

3. The API gateway will spin up on http://localhost:8080 and automatically 
   seed the database with raw automotive attributes.


[STEP B] INITIALIZE THE REACT + VITE COMPILER FRONTEND
1. Open a separate, concurrent terminal instance.
2. Step directly into your client interface folder:
   cd car-matcher-ui
3. Install lightweight client dependencies cleanly:
   npm install
4. Fire up the high-speed Vite local runtime server:
   npm run dev

5. The application UI will compile instantly and host on http://localhost:5173/


3. ASSIGNMENT HIGHLIGHTS FOR EVALUATORS
------------------------------------------------------------------------
* Algorithmic Weighting: The matching engine scores records dynamically based 
  on specific user-priority matrices (Safety, Range Efficiency, or Budget Headroom) 
  instead of executing standard flat filtering.
* Interactive Local State: Frontend incorporates state hooks allowing real-time 
  sidebar shortlisting and multi-vehicle specs matrix data comparisons.
* Strict Type Contracts: Unified interfaces map explicitly in 'src/types.ts' to 
  ensure absolute build-time type and schema integrity.
* Clean Environment: Pre-configured .gitignore rules protect repository storage 
  from dependency bloat like 'node_modules/' folders.

========================================================================
