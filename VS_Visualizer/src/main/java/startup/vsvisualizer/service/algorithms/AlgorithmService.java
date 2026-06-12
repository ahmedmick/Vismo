package startup.vsvisualizer.service.algorithms;

import startup.vsvisualizer.entity.visualization.VisualizationStep;
import java.util.List;

public interface AlgorithmService {
    List<VisualizationStep> generateSteps(List<Double> input);
}
