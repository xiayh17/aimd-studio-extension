/**
 * Floating Toolbar Styles
 * 
 * Styles for the ring dial toolbar that controls variable display modes.
 */

export function getToolbarStyles(): string {
    return `
        /* ============================================
           Floating Toolbar - Segmented Ring Dial
           ============================================ */
        .aimd-toolbar {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 1000;
        }

        .aimd-ring-dial {
            width: 64px;
            height: 64px;
            position: relative;
            cursor: pointer;
            background: #ffffff;
            border-radius: 50%;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .aimd-ring-dial:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .aimd-ring-dial:active {
            transform: scale(0.98);
        }

        /* SVG Ring */
        .dial-ring {
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
        }

        .dial-bg {
            stroke: var(--aimd-slate-200);
        }

        .dial-segment {
            stroke: var(--aimd-green-500);
            stroke-linecap: round;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: center;
        }

        /* Mode-specific segment rotation */
        .dial-segment[data-mode="0"] { transform: rotate(0deg); }
        .dial-segment[data-mode="1"] { transform: rotate(90deg); }
        .dial-segment[data-mode="2"] { transform: rotate(180deg); }
        .dial-segment[data-mode="3"] { transform: rotate(270deg); }

        /* Center label */
        .dial-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            pointer-events: none;
        }

        .dial-letter {
            font-size: 18px;
            font-weight: 700;
            color: var(--aimd-green-700);
            line-height: 1;
            transition: all 0.3s ease;
        }

        .dial-label {
            font-size: 8px;
            font-weight: 500;
            color: var(--aimd-slate-500);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 2px;
            transition: all 0.3s ease;
        }

        /* Segment labels around the ring */
        .dial-labels {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        .dial-seg-label {
            position: absolute;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            font-weight: 600;
            color: var(--aimd-slate-400);
            border-radius: 50%;
            transition: all 0.3s ease;
        }

        .dial-seg-label.active {
            color: var(--aimd-green-600);
            background: var(--aimd-green-50);
            transform: scale(1.1);
        }

        /* Position labels at cardinal directions */
        .seg-0 { top: 2px; left: 50%; transform: translateX(-50%); }
        .seg-1 { right: 2px; top: 50%; transform: translateY(-50%); }
        .seg-2 { bottom: 2px; left: 50%; transform: translateX(-50%); }
        .seg-3 { left: 2px; top: 50%; transform: translateY(-50%); }

        .seg-0.active { transform: translateX(-50%) scale(1.1); }
        .seg-1.active { transform: translateY(-50%) scale(1.1); }
        .seg-2.active { transform: translateX(-50%) scale(1.1); }
        .seg-3.active { transform: translateY(-50%) scale(1.1); }

        /* Mode colors */
        .aimd-ring-dial[data-mode="0"] .dial-segment { stroke: var(--aimd-green-500); }
        .aimd-ring-dial[data-mode="1"] .dial-segment { stroke: #6366f1; }
        .aimd-ring-dial[data-mode="2"] .dial-segment { stroke: #f59e0b; }
        .aimd-ring-dial[data-mode="3"] .dial-segment { stroke: #8b5cf6; }

        .aimd-ring-dial[data-mode="0"] .dial-letter { color: var(--aimd-green-700); }
        .aimd-ring-dial[data-mode="1"] .dial-letter { color: #4f46e5; }
        .aimd-ring-dial[data-mode="2"] .dial-letter { color: #d97706; }
        .aimd-ring-dial[data-mode="3"] .dial-letter { color: #7c3aed; }
    `;
}
