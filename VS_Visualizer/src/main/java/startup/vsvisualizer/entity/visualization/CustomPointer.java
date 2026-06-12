package startup.vsvisualizer.entity.visualization;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomPointer {
    private String fromId;       // e.g., "0", "tail", "floating"
    private String toId;         // e.g., "1", "head", "floating"
    private String type;         // "next" or "prev"
    private boolean isHighlighted; // True to animate/highlight this specific arrow
}
