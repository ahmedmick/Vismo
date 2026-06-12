package startup.vsvisualizer.entity.visualization;

import lombok.Data;
import java.util.List;

@Data
public class VisualizationStep {
    private int stepNumber;
    private String description;
    private List<Integer> highlightedIndices;
    private List<Integer> swappedIndices;
    private List<Double> currentArray;
    private Integer codeLineNumber;
    private Integer tempPointerIndex;
    private Double floatingNodeValue;
    private String floatingNodeLabel;
    private List<CustomPointer> customPointers;
}
