package startup.vsvisualizer.dto.algorithms;

import lombok.Data;
import startup.vsvisualizer.entity.visualization.VisualizationStep;
import java.util.List;

@Data
public class AlgorithmResponse {
    private List<VisualizationStep> steps;
    private int totalSteps;
    private String algorithmType;
}
