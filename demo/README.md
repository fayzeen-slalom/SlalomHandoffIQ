# Demo test inputs

Engineered inputs for the 7-minute analyzer demo. Each file maps to one scenario in the recording script.

| File | Mode | Handoff type | Expected outcome |
|---|---|---|---|
| `01-ba-dev-agile-stories.md` | Sprint Ready (Agile) | **BA → Developer** | 4 stories → 1 READY (Story 1, renewal Opp auto-create), 2 REFINE (Stories 2 & 4), 1 DEFER (Story 3, customer self-renewal). Click DEFER for the dramatic rewrite. |
| `02-integration-sf-stories.md` | Sprint Ready (Agile) | **Integration Team → Implementation Team** | 3 stories → 1 READY (Account sync via MuleSoft platform event), 1 REFINE (Marketo email sync — click into this one), 1 DEFER (Order status webhook). DoR criteria visibly shift to payload schema / target object / upsert. |
| `03-client-discovery-handoff.md` | Gate / Handoff (Waterfall) | **Client → Impl. Team** | Discovery doc with Business Context / Scope / Stakeholders **present**; skeletal user stories + vague data section **incomplete**; **NFRs entirely missing** (climax). Lowest quality dim should be testability. |
| `04-analyzer-enhancement-story.md` | Sprint Ready (Agile) | **BA → Developer** | The meta moment. One vague BA story for the Copy/Download feature you just shipped. Should land REFINE or DEFER. Rewrite + working feature on screen closes the SDLC loop. |

## How to use
- **Upload**: drag any of these into the upload card on the setup screen.
- **Paste**: open the file, copy contents, click "Or paste text directly" on the upload screen.
- Inputs are deliberately sized to fit within the 8K output token budget and to render cleanly in the story-card UI.

## Notes for the recording
- The 67% rework stat in your hook needs a source — flag it before publishing or swap for a stat you can attribute.
- Scenario 2's "different lens" talking point lands because the handoff-type DoR focus changes (`integration-sf` → payload schema / target object / upsert), even though Kanika's underlying 8-point rubric is the same. That distinction is real and worth making.
- For Scenario 4's meta moment, you can show **Story 04** as the BA's vague version, run the analyzer live, then point at the Copy/Download buttons in the results UI as "the working feature."
