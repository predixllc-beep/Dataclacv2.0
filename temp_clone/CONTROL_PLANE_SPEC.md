# Control Plane Specification

## Overview
The Control Plane is the interface between the human operators and the autonomous trading bots. It allows bidirectional data flow: telemetric state *out*, and administrative commands *in*.

## Core Capabilities

### 1. Agent Control
- Global Kill/Pause/Resume per agent.
- Live override of confidence thresholds (e.g., forcing a statistical arb agent to require 90% confidence instead of 75%).
- View live autonomous reasoning logs (Why did the agent decide to BUY_YES?).

### 2. Strategy & Capital Control
- Hot-swap capital allocation (drain capital from Strategy A, allocate to Strategy B).
- Enable/Disable specific alphas.

### 3. Execution Control (OMS/EMS)
- View the entire Order State Machine in real-time.
- Manual intervention (force-cancel child orders, convert resting limit to market-maker skew).
- Manual order injection (Trading Terminal Mode).

### 4. Risk & Failure
- Emergency Flatten: Big red button that exits all risk at market.
- Kill Switch: Halts all new outgoing signals.
- Configure limits: Adjust Max Drawdown limits on the fly.
