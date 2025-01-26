import React from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePicker } from "@/components/ui/date-picker";
import { History as HistoryIcon, Info, Eye } from "lucide-react";
import { useAnalysisStore } from "@/utils/store";
import { format } from "date-fns";

export default function History() {
  const {
    metricsHistory,
    isLoadingHistory,
    historyFilters,
    currentPage,
    itemsPerPage,
    loadHistory,
    setHistoryFilters,
    setCurrentPage,
    viewHistoryDetails,
  } = useAnalysisStore();

  React.useEffect(() => {
    loadHistory();
  }, [historyFilters, currentPage]);

  const totalPages = Math.ceil(metricsHistory.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const displayedHistory = metricsHistory.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/50 shadow-sm backdrop-blur-sm border border-white/20">
            <HistoryIcon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Analysis History</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-health text-transparent bg-clip-text">
            Your Analysis History
          </h1>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <DatePicker
              selected={historyFilters.startDate}
              onSelect={(date) => setHistoryFilters({ startDate: date })}
              placeholder="Start Date"
            />
            <DatePicker
              selected={historyFilters.endDate}
              onSelect={(date) => setHistoryFilters({ endDate: date })}
              placeholder="End Date"
            />
            <Button 
              variant="outline"
              onClick={() => setHistoryFilters({ startDate: null, endDate: null })}
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Content */}
        <Card className="p-6">
          {isLoadingHistory ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full animate-pulse" />
              ))}
            </div>
          ) : metricsHistory.length === 0 ? (
            <div className="text-center py-8">
              <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Analysis History</h3>
              <p className="text-muted-foreground mb-4">
                Start by analyzing your first sample to build your health history.
              </p>
              <Button onClick={() => window.location.href = "/"}>
                Start New Analysis
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Metrics</TableHead>
                    <TableHead>Overall Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedHistory.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{format(new Date(entry.date), 'PPP')}</TableCell>
                      <TableCell>{entry.metrics.length} metrics analyzed</TableCell>
                      <TableCell>
                        <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-sm">
                          Completed
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewHistoryDetails(entry.id)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages - 1}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
}