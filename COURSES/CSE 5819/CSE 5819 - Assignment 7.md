***Riley Francis - rif17002***
[[CSE 5819 - Assignment 7]]
- - -
## Cluster Analysis - K-means
#### a.
We will start with the initial centroid locations of $\{0, 0.4, 1\}$ for A, B, and C.

| Iter | 0.1 | 0.25 | 0.45 | 0.55 | 0.8 | 0.9 | A     | B     | C    |
| ---- | --- | ---- | ---- | ---- | --- | --- | ----- | ----- | ---- |
| 1    | A   | B    | B    | B    | C   | C   | 0.1   | 0.417 | 0.85 |
| 2    | A   | A    | B    | B    | C   | C   | 0.175 | 0.5   | 0.85 |
| 3    | A   | A    | B    | B    | C   | C   | 0.175 | 0.5   | 0.85 |
##### b. 
The sum-of-squared errors (SSE) of the clustering after the 3rd iteration can be calculated by$$SSE=\sum_{i=1}^k \sum_{x\in C_i}||x-\mu_i||^2$$We can calculate for each centroid, and then sum them:

| Centroid | SSE                                    |
| -------- | -------------------------------------- |
| A        | $(0.1-0.175)^2+(0.25-0.175)^2=0.01125$ |
| B        | $(0.45-0.5)^2+(0.55-0.5)^2=0.005$      |
| C        | $(0.8-0.85)^2+(0.9-0.85)^2=0.005$      |
$$0.01125+0.005+0.005=0.2125$$
##### c.
It is very possible to obtain empty clusters. Any given cluster can become empty if there are no data points that are closest to it. For example, if our initial centroid choices were $\{0.3375,0.85,1\}$^[Note that these initial points are already stabilized and are not changed by k-means iterations because they are already centroids of the clustered points.], then the $0.1,0.25,0.45,0.55$ are clustered with centroid $0.3375$, and $0.8,0.9$ are clustered with $0.85$, leaving no points to be clustered with centroid $1$. This is just an example of a poor initial centroid choice.

## Cluster Analysis - Hierarchical Clustering
We have the following data (5 points with 2 features):

| $x_1$ | $x_2$ |
| ----- | ----- |
| 5     | 60    |
| 3     | 50    |
| 1     | 80    |
| 9     | 50    |
| 8     | 70    |
##### a.
![[Drawing 2025-11-02 13.26.17.excalidraw|800]]
##### b.
We can compute the normalized features ($z$) using $$z=\frac{x-\mu}{\sigma}$$So, the normalized points are as follows, using $\mu_1=5.2$, $\mu_2=62$, $\sigma_1=3.35$, $\sigma_2=13.04$

| $z_1$ | $z_2$ |
| ----- | ----- |
| -0.06 | -0.15 |
| -0.66 | -0.92 |
| -1.25 | 1.38  |
| 1.14  | -0.92 |
| 0.84  | 0.61  |
![[Drawing 2025-11-02 14.19.01.excalidraw|800]]
## Part 3: Programming
***Submitted Separately***

## Part 1: ChatGPT
##### 1. What is cluster analysis?
Cluster analysis is a method used to group data points into clusters such that points within the same cluster are more similar to each other than to those in other clusters. It helps uncover hidden patterns or structures in unlabeled data. Similarity is usually measured using metrics like Euclidean distance or cosine similarity. The goal is to minimize intra-cluster variance while maximizing inter-cluster separation.
##### 2. How many kinds of clustering methods are there?
There are several main types of clustering methods, including partitioning methods (like k-means), hierarchical methods, density-based methods (like DBSCAN), and model-based methods (like Gaussian Mixture Models). Each method defines “clusters” differently—by distance, density, connectivity, or probability. The choice depends on data characteristics and the desired output structure. Some hybrid and spectral clustering techniques also combine multiple approaches.
##### 3. What are the pros and cons of k-means?
K-means is simple, efficient, and scales well to large datasets, making it one of the most popular clustering algorithms. It works best when clusters are roughly spherical and of similar size. However, it requires specifying the number of clusters $k$ in advance and is sensitive to initial centroid placement and outliers. It also struggles with non-linear cluster boundaries and varying densities.
##### 4. What are the pros and cons of hierarchical clustering?
Hierarchical clustering creates a tree-like structure (dendrogram) that shows relationships among clusters at different levels of similarity. It does not require specifying the number of clusters beforehand and provides a clear visual interpretation of the data’s structure. However, it can be computationally expensive for large datasets (with time complexity $O(n^3)$) and is sensitive to noise and distance metric choice. Once a merge or split occurs, it cannot be undone.
##### 5. What are the pros and cons of DBSCAN?
DBSCAN (Density-Based Spatial Clustering of Applications with Noise) groups together points that are closely packed and labels sparse points as outliers. It can find clusters of arbitrary shape and does not require specifying the number of clusters in advance. However, it struggles when clusters have varying densities or when choosing good parameters ($\epsilon$ and minPts) is difficult. It also performs poorly in high-dimensional spaces where distances become less meaningful.
##### 6. If data is sparse, is there a faster algorithm to run k-means?
Yes, algorithms like Mini-Batch K-Means and K-Means++ can significantly speed up clustering on sparse or large datasets. Mini-Batch K-Means uses small random subsets of data to update centroids, reducing computational cost while maintaining good accuracy. K-Means++ improves initialization, which often leads to faster convergence and better results. Additionally, using sparse matrix representations can optimize distance calculations.
##### 7. What are the best validity indices to measure the validity of clusters?
Common validity indices include the Silhouette Score, Davies–Bouldin Index, and Calinski–Harabasz Index. The Silhouette Score measures how similar each point is to its own cluster compared to others, ranging from -1 to 1. Lower Davies–Bouldin and higher Calinski–Harabasz values indicate better clustering quality. These metrics help assess compactness and separation without external labels.
##### 8. How to compare different clustering results?
To compare clustering results, one can use internal indices (like Silhouette Score) or external metrics (like Adjusted Rand Index) when true labels are available. Visualization methods such as scatter plots, dendrograms, or t-SNE projections can help qualitatively assess differences. Comparing stability across multiple runs also indicates consistency. Ultimately, the best method depends on whether the data is labeled and what aspects of clustering are most important.
